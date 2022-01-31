<script lang="js">
  import { operationStore, query, setClient } from '@urql/svelte';
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
	import {clientWithCookieSession} from '../../client'
  import EditStore from '$lib/EditStore.svelte';

  let cookies = Cookies.get('fauna-session');

  if(cookies) {
    const { secret } = JSON.parse(cookies);
    console.log('secret', secret);
    setClient(clientWithCookieSession(secret));
  }

  const currentStore = operationStore(`
    query GetStore($id: ID!) {
      findStoreByID(id: $id) {
        _id
        name
        email
        paymentMethods
        categories
        owner {
          name
        }
      }
    }
  `,
  { id: $page.params.id },
  { requestPolicy: 'network-only' }
  )

  query(currentStore)

  export let store = null;

  currentStore.subscribe(({data}) => {
    if(data) {
      store = data.findStoreByID;
    }
  })

</script>
{#if !cookies}
  <p class="login-promt">You must be logged in to create a post</p>
{/if}
{#if $currentStore.fetching}
<p>Loading...</p>
{:else}

<div class="uk-container">
  <div class="uk-card uk-card-default card">
    <h3>{$currentStore.data.findStoreByID.name}</h3>
    <p><b>Categories</b>{$currentStore.data.findStoreByID.categories.join(',')}</p>
    <p><b>Payment</b>{$currentStore.data.findStoreByID.paymentMethods.join(',')}</p>
    <EditStore selectedStore={store}/>
  </div>
</div>

{/if}

<style>
  .login-promt {
    color: coral;
  }
  .card {
    padding: 40px;
  }
</style>