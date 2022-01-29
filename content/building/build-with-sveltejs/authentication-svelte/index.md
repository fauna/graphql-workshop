---
title: "Authentication (Svelte path)"
date: 2022-01-27T13:35:32-04:00
draft: false
weight: 32
pre: "<b>b. </b>"
---


In this section, you will learn how to do user authentication from your client application. 

You can find the completed code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.2-user-auth).


## Adding Styles [Optional]

Add some basic styling to your application. You can add [UIKit][uikit] library for styling. Make the following changes to your `src/app.html` file. Feel free to use a CSS library of your choice or write your own CSS.


{{< tabs groupID="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight html >}}
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="description" content="" />
		<link rel="icon" href="%svelte.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%svelte.head%
		<!-- UIkit CSS -->
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.10.1/dist/css/uikit.min.css" />

		<!-- UIkit JS -->
		<script src="https://cdn.jsdelivr.net/npm/uikit@3.10.1/dist/js/uikit.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/uikit@3.10.1/dist/js/uikit-icons.min.js"></script>
	</head>
	<body>
		<div id="svelte">%svelte.body%</div>
	</body>
</html>
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## User Signup

Create a new route for user signup. Create a new file `src/routes/signup.svelte` and add the following code.

{{< tabs groupId="frontend" >}}
{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}

<script lang="js">
  import { setClient, mutation } from '@urql/svelte';
  import client from '../client'
  import { goto } from '$app/navigation';

  setClient(client);

  const registerMutation = mutation({
    query: `
      mutation ($name: String!, $email: String!, $password: String!) {
        registerOwner(name: $name, email: $email, password: $password) {
          email
          _id
        }
      }
    `,
  });

  async function onSubmit(e) {
    const formData = new FormData(e.target);

    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    const { name, email, password } = data;
    const resp = await registerMutation({ name, email, password })
    if (resp.data?.registerOwner) {
      goto('/');
    } 
    if(resp.error) {
      alert(resp.error.message);
      console.log(resp.error);
    }
  }
</script>


<div class="wrap">
  <div>
    <div class="uk-card uk-card-default uk-card-body">
      <h3 class="uk-card-title">Sign up</h3>
        <form on:submit|preventDefault={onSubmit}>
          <div class="uk-margin">
            <input 
                class="uk-input" 
                type="text"
                placeholder="Username" 
                name="name" 
                autoComplete="off"
            />
          </div>
          <div class="uk-margin">
            <input 
                class="uk-input" 
                type="text" 
                placeholder="Email" 
                name="email"
            />
          </div>
          <div class="uk-margin">
            <input 
                class="uk-input" 
                type="password" 
                placeholder="Password" 
                name="password"
            />
          </div>
          <div class="uk-margin">
            <input class="uk-input" type="submit" />
          </div>
        </form>
    </div>
  </div>
</div>

<style>
  .wrap {
    margin: 10% 40%;
    min-width: 300px;
  }
</style>

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
    title="signup.svelte"
    pattern="signup.svelte" 
    style="fauna"
/>}}

In the previous code snippet, you have a simple form page. When you submit the form the `registerOwner` mutation is fired and a new owner is registered.

Visit [localhost:3000/signup](http://localhost:3000/signup) and try to register a owner.

Navigate to *Collections* in your Fauna dashboard and review the *Owner* collection. Your newly registered users will appear in this collection.

{{< figure
  src="../../build-with-nextjs/authentication/images/1.png" 
  alt="Newly registered user"
>}}


### User Login

Next, create a new page for users to log in to the application. Create a new file `src/routes/login.svelte` and add the following code. 

{{< tabs groupId="frontend" >}}
{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}
<script>
  import { setClient, mutation } from '@urql/svelte';
  import client from '../client';
  import { goto } from '$app/navigation';

  setClient(client);

  let error;

  const loginMutation = mutation({
    query: `
      mutation OwnerLogin($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          secret
          ttl
        }
      }
    `,
  });
  async function onSubmit(e) {
    const formData = new FormData(e.target);

    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    const { email, password } = data;
    const resp = await loginMutation({ email, password })
    
    console.log('resp', resp)

    if(resp.data?.login) {
      alert('Login Successful');
      goto('/')
    }
    if(resp.error) {
      error = resp.error?.message;
    }
  }
</script>

<div class="wrap">
  <div class="uk-card uk-card-default uk-card-body">
    <h3 class="uk-card-title">Login</h3>
    {#if error}
      <div class="uk-alert-danger" uk-alert style={{ maxWidth: '300px', padding: '10px'}}>
        {error}
      </div>
    {/if}
    <form on:submit|preventDefault={onSubmit} >
      <div class="uk-margin">
        <input 
          class="uk-input" 
          type="text" 
          placeholder="Email" 
          name="email"
        />
      </div>
        <div class="uk-margin">
          <input 
            class="uk-input" 
            type="password" 
            placeholder="Password" 
            name="password"
          />
        </div>
        <div class="uk-margin">
          <input class="uk-input" type="submit" />
        </div>
    </form>
  </div>
</div>

<style>
  .wrap {
    margin: 10% 40%;
    min-width: 300px;
  }
</style>

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

To ensure everything is working as intended, run the application with `npm run dev` command, and visit [localhost:3000/login](http://localhost:3000/login). Verify the login function is working. Log in with a user you have registered before. Observe the console tab in your browser.

{{< figure
  src="../../build-with-nextjs/authentication/images/3.png" 
  alt="User login view"
>}}

{{< figure
  src="../../build-with-nextjs/authentication/images/4.png" 
  alt="Login response"
>}}


If you are getting a secret back from your GraphQL request, that means everything is working as intended. You can now use this secret to interact with other resources in Fauna. In the next section, you learn how to manage your user sessions with the client. 

---
[uikit]: https://getuikit.com/
