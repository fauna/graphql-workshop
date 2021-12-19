<script>
  import { goto } from '$app/navigation';
  import { mutation } from "svelte-apollo";
  import { gql } from "@apollo/client/core";

  const LOGIN = gql`
    mutation OwnerLogin($email: String!, $password: String! ) {
      login(email: $email, password: $password) {
        ttl
        secret
      }
    }
  `;

  let password = "";
  let email = "";
  let errorMsg = "";

  const login = mutation(LOGIN);

  async function onSubmit(e) {
    const formData = new FormData(e.target);
    errorMsg = "";
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data)

    try {
      await login({
        variables: {
          ...data
        }
      });
      alert('User Logged in Successfully');
      goto(`/`, { replaceState: true })
    } catch (error) {
      errorMsg = error;
      console.log(error);
    }
  }


</script>

<div class="main-container">
  <div>
    <div class="uk-card uk-card-default uk-card-body">
      <h3 class="uk-card-title">Login</h3>
      
      {#if errorMsg !== ''}
        <div class="uk-alert-danger" uk-alert>
          <p>{errorMsg}</p>
        </div>  
      {/if}

      <form on:submit|preventDefault={onSubmit}>
        <div class="uk-margin">
          <input 
            class="uk-input" 
            type="text" 
            placeholder="Email" 
            name="email"
            bind:value="{email}"
          />
        </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="password" 
              placeholder="Password" 
              name="password"
              bind:value="{password}"
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
  .main-container {
    margin: 20% auto 0 auto;
    max-width: 500px;
  }
</style>