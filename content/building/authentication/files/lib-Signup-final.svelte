<script>
  import { mutation } from "svelte-apollo";
  import { gql } from "@apollo/client/core";
  
  const SIGN_UP = gql`
    mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
      registerOwner(email: $email, name: $name, password: $password) {
        _id
        name
        email
      }
    }
  `;

  let password = "";
  let email = "";
  let name = "";

  const signUpUser = mutation(SIGN_UP);

  async function onSubmit(e) {
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data)

    try {
      await signUpUser({
        variables: {
          ...data
        }
      });
      alert('User Signed Up Successfully');
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div uk-grid="true">
  <div class="main-container">
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
              bind:value="{name}"
            />
          </div>
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