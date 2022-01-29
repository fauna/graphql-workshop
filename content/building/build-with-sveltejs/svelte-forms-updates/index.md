---
title: "Create Read Update Delete (CRUD)"
date: 2021-01-29T13:35:32-04:00
draft: false
weight: 35
pre: "<b>e. </b>"
---

This chapter builds the front-end functionality to *create*, *delete*, and *update* store data in Fauna.

### Create a new store

Create a new page to add new stores. Create a file `src/routes/store/new.svelte` and add the following code. On form submit, you create a new store for the logged-in user.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/routes/store/new.svelte
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
        alert('Post created successfully')
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
```
{{% /tab %}}
{{< /tabs >}}

### View Store

Create a new page to show each store. Create a new file `src/routes/store/[id].svelte` and add the following code. Notice in the following code `findStoreByID` is used to retrieve store information.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}
```svelte
// src/routes/store/[id].svelte

<script lang="js">
  import { operationStore, query, setClient } from '@urql/svelte';
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
	import {clientWithCookieSession} from '../../client'


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

  export let post = null;

  currentStore.subscribe(({data}) => {
    if(data) {
      post = data.findPostByID;
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


```

{{% /tab %}}
{{< /tabs >}}

### Edit store
