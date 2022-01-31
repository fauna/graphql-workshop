<script>
  import Cookies from 'js-cookie';
  import { setClient, mutation } from '@urql/svelte';
  import { clientWithCookieSession } from '../client';
  import { goto } from '$app/navigation';

  let userSession = Cookies.get('fauna-session');

  if(userSession) {
    const { secret } = JSON.parse(userSession);
    setClient(clientWithCookieSession(secret));
  }


  const updateStore = mutation({
    query: `
      mutation UpdateStore(
        $id: ID!, 
        $name: String!, 
        $email: String!, 
        $categories: [String!], 
        $paymentMethods: [String!]) 
        {
          updateStore(id: $id, data: {
            name: $name,
            email: $email,
            categories: $categories,
            paymentMethods: $paymentMethods
          }) {
            _id
          }
        }
    `
  })

	export let selectedStore;
  let isEdit = false;
  let name = '';
  let email = '';
  let categories = [''];
  let paymentMethods = [''];
  let errorMessage = '';

  function toggleEdit() {
    isEdit = !isEdit;
    if(isEdit) {
      name = selectedStore.name;
      email = selectedStore.email;
      categories = selectedStore.categories.join(',');
      paymentMethods = selectedStore.paymentMethods.join(',');
    }
  }

  async function onSubmit(e) {
    const response = await updateStore({ 
      id: selectedStore._id, 
      name, 
      email,
      categories,
      paymentMethods
    })
    console.log('updatedPost', response);
    const { data, error } = response;
    if(error) {
      errorMessage = error.message;
    }
    if(data) {
      alert('Store updated');
      goto(`/`);
    }
  }
</script>


{#if isEdit}
<div class="uk-card uk-card-default wrap">
  <h5>Edit Store</h5>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={onSubmit} >
      <div class="input-blocks">
        <label for="name">Store Name</label>
        <input
          class="uk-input" 
          type="text"
          name="name"
          bind:value={name}
        />
      </div>
      <div class="input-blocks">
        <label for="email">Email</label>
        <input
          class="uk-input" 
          type="text"
          name="email"
          bind:value={email}
        />
      </div>
      <div class="input-blocks">
        <label for="paymentMethods">Payment methods (seperated by commas)</label>
        <input
          class="uk-input" 
          type="text"
          name="paymentMethods"
          bind:value={paymentMethods}
        />
      </div>
      <div class="input-blocks">
        <label for="categories">Categories (seperated by commas)</label>
        <input
          class="uk-input" 
          type="text"
          name="categories"
          bind:value={categories}
        />
      </div>
      <button class="update uk-button" type="submit" disabled={!userSession}>Update</button>
    </form>
</div>
{/if}

<button on:click={toggleEdit} class="update uk-button" disabled={!userSession}>Edit</button>

<style>
  .error {
    color: coral;
  }
  .update {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .wrap {
    margin-top: 20px;
    padding: 40px;
  }
</style>