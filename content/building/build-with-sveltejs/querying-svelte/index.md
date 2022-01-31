---
title: "Querying data"
date: 2022-01-28T13:35:32-04:00
draft: false
weight: 34
pre: "<b>d. </b>"
---

In this section, you learn how to query data from your client application and implement attribute-based access control (ABAC).

> “Attribute-based access control, also known as policy-based access control for IAM, defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together.” – wikipedia

In the previous section, you were able to log in a user and save their session in browser cookies. To query retrieve data using the access token (saved in session cookies) you first need to define a role in Fauna. This role will specify the resources you can interact with. 

Navigate to Fauna [dashboard](https://dashboard.fauna.com/accounts/login). Select *Security > Roles > New Role* to create a new role.

1. Name your new role `AuthRole` since all authenticated users will assume this role. 
1. In the collection section Add Owner and Store. Provide *read* privilege to both **Owner** and **Store** collections. 
1. In the *Indexes* section add `findOwnerByEmail` and `owner_stores_by_owner` index. Give read privilege to both of these indexes.
2. Navigate to the membership tab.
 
{{< figure
  src="../../build-with-nextjs/querying-data/images/create_new_auth_role.png" 
  alt="specify privileges"
>}}

> The *findOwnerByEmail* query lets you query a user by email using the generated access token. The *owner_stores_by_owner* lets you query the stores that belong to a particular user.

Membership in Fauna specific identities that should have the specified privileges. In this scenario all the records in the Owner collection are members.

1. In the membership tab add **Owner** collection as the member collection. 
2. Select Save.


{{< figure
  src="../../build-with-nextjs/querying-data/images/select_membership.png" 
  alt="select membership"
>}}

When an owner logs in to your application you want to show that user their basic information (i.e. username, email) and all the stores that belong to that owner. To do so you can make the following GraphQL query with the owner’s email as a parameter.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
query findbyEmail($email: String!) {
  findOwnerByEmail(email: $email) {
    _id
    name
    email
    stores {
      data {
        _id
        name
      }
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

You will use the secret retrieved from the `login` function to make the previous query. The secret is saved in the browser session cookies when a user logs in. Therefore, you can retrieve it from the cookies. Once you retrieve the session secret, you can pass it down to the GraphQL client and set the header.

Create a new function called `clientWithCookieSession` in your `src/client.js` file as follows. The `clientWithCookieSession` takes in a token as parameter and sets up the `@urql/svelte` client.


{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/client.js
...
export const clientWithCookieSession = token => createClient({
  url: 'https://graphql.us.fauna.com/graphql',
  fetchOptions: () => {
    console.log('token', token);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});
```
{{% /tab %}}
{{< /tabs >}}

Next, add the following code to your `src/routes/index.svelte` file.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/routes/index.svelte
<script>
  import { operationStore, query, setClient } from '@urql/svelte';
	import {clientWithCookieSession} from '../client';
  import Cookie from 'js-cookie';

  const cookies = Cookie.get('fauna-session');

  const { email, secret} = cookies ? JSON.parse(cookies) : {};
  setClient(clientWithCookieSession(secret));

  const findCurrentOwner = operationStore(`
    query findbyEmail($email: String!) {
      findOwnerByEmail(email: $email) {
        _id
        name
        email
        stores {
          data {
            _id
            name
          }
        }
      }
    }
  `,
  {
    email,
  },
  { requestPolicy: 'network-only' }
  );
  query(findCurrentOwner);
</script>

<div class="uk-container wrap">
  {#if !cookies}
    <p>
      You are not Loged in.
    </p>
    <a href="/login">Login</a>
  {/if}

  {#if $findCurrentOwner.data}
    <h4>{$findCurrentOwner.data.findOwnerByEmail.name}</h4>
    <div><b>Email:</b> {$findCurrentOwner.data.findOwnerByEmail.email}</div>
    <ul class="uk-list uk-list-large uk-list-striped">
      {#each $findCurrentOwner.data.findOwnerByEmail.stores.data as store}
      <li>
        <div class="container">
          <div>{store.name}</div>
          <p uk-margin>
            <a href="/store/{store._id}">View</a>
          </p>
        </div>
      </li>
      {/each}
    </ul>
  {/if}

</div>

<style>
  .wrap {
    max-width: 350px;
  }
</style>

```
{{% /tab %}}
{{< /tabs >}}

{{< attachments
    title="src/routes/index.svelte"
    pattern="index.svelte" 
    style="fauna"
/>}}

Run your application with `npm run dev` command and make sure everything is working as intended.

{{< figure
  src="./images/app-status.png" 
  alt="Application Status"
>}}

### Updating the app UI

Modify the layout of the application. The app right now could use a navbar for better navigation. Next, go ahead and add a Navbar.

Create a new navbar component. Create a new file `src/lib/Nav.svelte` and add the following code for Navbar.
{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/lib/Nav.svelte
<script lang="js">
  import Cookies from 'js-cookie';

  function logout() {
    Cookies.remove('fauna-session');
    alert('User Logoed Out');
  }
</script>

<nav class="uk-navbar-container wrap" >
  <div class="uk-navbar-left">
    <ul class="uk-navbar-nav">
      <li class="uk-active"><a href='/'>Fauna E-Com</a></li>
    </ul>
  </div>
  <div class="uk-navbar-right">
    <ul class="uk-navbar-nav">
      <li >
        <a href='/store/new' class="uk-button uk-button-primary add-btn">
          Add Store
        </a>
      </li>
      <li >
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={logout} class="uk-button uk-button-danger add-btn">
          Logout
        </a>
      </li>
    </ul>
  </div>
</nav>

<style>
.wrap {
  display: flex;
}
.add-btn {
  color: azure;
}
</style>
```

{{% /tab %}}
{{< /tabs >}}

{{< attachments
    title="src/lib/Nav.svelte"
    pattern="Nav.svelte" 
    style="fauna"
/>}}


Apply a layout to your application, so the Navbar component appears on every page. Create a new file `src/routes/__layout.svelte` and add the following code snippet.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/routes/__layout.svelte
<script>
  import Nav from '$lib/Nav.svelte';
</script>
<Nav />
<slot></slot>
```
{{% /tab %}}
{{< /tabs >}}

Once the changes are applied notice that a navbar is appearing in every pages of your application.

Currently, the `Add Store` and `Logout` buttons are always visible. These buttons should only be visible when a user is logged. Otherwise, display the `Register` and `Login` buttons. 

You can use a svelte **writeable store** to manage the state of your application dynamically. First create a new file `src/store.js` and add the following code.


{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
import { writable } from 'svelte/store';

export const userSession = writable(null);
```
{{% /tab %}}
{{< /tabs >}}


Update the `userSession` in svelte-store when a user successfully logs in. Make the following changes to your `src/routes/login.svelte` file.


{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte {hl_lines=["4",20]}
// src/routes/login.svelte
<script>
  ...
  import { userSession } from '../store';
  ...

  async function onSubmit(e) {
    const formData = new FormData(e.target);

    ...
    if(resp.data?.login) {
      alert('Login Successful');

      Cookies.set(
        'fauna-session', 
        JSON.stringify(resp.data.login),
        { expires: new Date(resp.data.login.ttl) }
      );

      userSession.update(() => (resp.data.login));

      goto('/')
    }
  }
</script>
```
{{% /tab %}}
{{< /tabs >}}

{{< attachments
    title="src/routes/index.svelte"
    pattern="index.svelte" 
    style="fauna"
/>}}

Update the `src/lib/Nav.svelte` file as follows.


{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte {hl_lines=["4","6-14", "20-21", "33-56"]}
// src/lib/Nav.svelte
<script lang="js">
  import Cookies from 'js-cookie';
  import { userSession } from '../store.js';

  let user;
  userSession.subscribe(val => {
    user = val;
    const cookies = Cookies.get('fauna-session');
    if(!val && cookies) {
      user = JSON.parse(cookies);
      userSession.set(user);
    }
  });


  function logout() {
    Cookies.remove('fauna-session');
    alert('User Logoed Out');
    userSession.update(() => null);
    window.location.reload();
  }
</script>

<nav class="uk-navbar-container wrap" >
  <div class="uk-navbar-left">
    <ul class="uk-navbar-nav">
      <li class="uk-active"><a href='/'>Fauna E-Com</a></li>
    </ul>
  </div>
  <div class="uk-navbar-right">
    <ul class="uk-navbar-nav">
      {#if user}
        <li >
          <a href='/store/new' class="uk-button uk-button-primary add-btn">
            Add Store
          </a>
        </li>
        <li >
          <!-- svelte-ignore a11y-missing-attribute -->
          <a on:click={logout} class="uk-button uk-button-danger add-btn">
            Logout
          </a>
        </li>
      {:else}
        <li >
          <a href='/login' class="uk-button uk-button-primary add-btn">
            Login
          </a>
        </li>
        <li >
          <a href='/signup' class="uk-button uk-button-danger add-btn">
            Signup
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<style>
.wrap {
  display: flex;
}
.add-btn {
  color: azure;
}
</style>
```
{{% /tab %}}
{{< /tabs >}}


{{< attachments
    title="src/lib/Nav.svelte"
    pattern="Nav-2.svelte" 
    style="fauna"
/>}}


Now your application state will be synced when user logs in or logs out. 

That’s all for this section. In the next section, you implement *Create* *Delete* and *Update* stores. You also do a deep dive into custom resolvers and Fauna Query Language (FQL).