<script lang="js">
  import Cookies from 'js-cookie';
  import { setClient, mutation } from '@urql/svelte';
  import { clientWithCookieSession } from '../../client';
  import { goto } from '$app/navigation';


  let cookies = Cookies.get('fauna-session');

  if(cookies) {
    const { secret, email } = JSON.parse(cookies);
    console.log('secret', secret);
    setClient(clientWithCookieSession(secret));
  }

  const newStore = mutation({
    query: `
    mutation CreateNewStore(
      $name: String!
      $email: String!
      $ownerId: ID!
      $categories: [String]
      $paymentMethods: [String]
    ) {
      createStore(data: {
        email: $email,
        name: $name,
        owner: {
          connect: $ownerId
        },
        categories: $categories,
        paymentMethods: $paymentMethods
      }) {
        _id
        name
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

    const { email, name, paymentMethods, categories } = data;
    console.log('datadata ', categories.split(','));
    try {
      const { ownerId } = JSON.parse(cookies);
      if(!ownerId) {
        alert('You must be logged in to create a post');
        return;
      }
      console.log('--->', ownerId);
      const resp = await newStore({ 
        name, 
        email, 
        categories: categories.split(','), 
        paymentMethods: paymentMethods.split(','),
        ownerId
      }); 

      console.log('resp', resp);
      if(resp.data.createStore) {
        alert('Store created successfully')
        goto('/')
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="uk-container">
  <h3>Create a new store</h3>
  {#if !cookies}
    <p class="login-promt">You must be logged in to create a post</p>
  {/if}
  <form on:submit|preventDefault={onSubmit} >
    <div class="input-blocks">
      <label for="name">Store Name</label>
      <input
        class="uk-input" 
        type="text"
        name="name"
        value=""
      />
    </div>
    <div class="input-blocks">
      <label for="email">Email</label>
      <input
        class="uk-input" 
        type="text"
        name="email"
        value=""
      />
    </div>
    <div class="input-blocks">
      <label for="paymentMethods">Payment methods (seperated by commas)</label>
      <input
        class="uk-input" 
        type="text"
        name="paymentMethods"
        value=""
      />
    </div>
    <div class="input-blocks">
      <label for="categories">Categories (seperated by commas)</label>
      <input
        class="uk-input" 
        type="text"
        name="categories"
        value=""
      />
    </div>
    <button class="uk-input btn" type="submit">Submit</button>
  </form>
</div>

<style>
  .input-blocks {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin-bottom: 1em;
  }
  .login-promt {
    color: coral;
  }
  .btn {
    max-width: 300px;
  }
</style>