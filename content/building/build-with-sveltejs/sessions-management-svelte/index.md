---
title: "Session management"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 33
pre: "<b>c. </b>"
---


In this section, you learn about session management in your client application. There are several ways to manage sessions in single-page web applications. The most common one is to manage sessions through browser cookies. In this section, you learn how to manage sessions with browser cookies and svelte store.

The `js-cookie` npm package is the easiest way to work with cookies. Install this package in your project with the following command.

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```console
npm i js-cookie
```
{{% /tab %}}
{{< /tabs >}}

When a user logs in, use the js-cookie library to store the login response in the browser cookies section. Make the following changes to your `src/routes/login.svelte` file.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte {hl_lines=["35-40",3,17,18]}
<script>
  import { setClient, mutation } from '@urql/svelte';
  import Cookies from 'js-cookie';
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
          email
          ownerId
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
    
    if(resp.data?.login) {
      alert('Login Successful');
      Cookies.set(
        'fauna-session', 
        JSON.stringify(resp.data.login),
        { expires: new Date(resp.data.login.ttl) }
      )
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
```
{{% /tab %}}
{{< /tabs >}}

Sign in with a user you have registered. Observe your browser cookies. Notice that a cookie value named fauna-session is saved. 

{{< figure
  src="../../build-with-nextjs/session-management/images/1.png" 
  alt="session from cookies"
>}}

In the next section, you learn how to retrieve the user access token from your cookies and make GraphQL queries and mutations using it. 