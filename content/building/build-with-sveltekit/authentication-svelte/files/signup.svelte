<!-- Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0 -->

<!-- src/routes/signup.svelte -->

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