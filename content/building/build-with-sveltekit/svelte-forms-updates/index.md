---
title: "Create Read Update Delete (CRUD)"
date: 2021-01-29T13:35:32-04:00
draft: false
weight: 35
pre: "<b>e. </b>"
---

This chapter completes the front-end functionality to *create*, *read*, *update*, and *delete* (CRUD) shop data in Fauna.

### Create a new store

Create a new page to add new stores. Create a file `src/routes/store/new.svelte` and add the following code. On form submit, you create a new store for the logged-in user.

{{< tabs groupId="frontend-svelte" >}}
{{< tab name="SvelteKit" >}}
{{< highlight svelte >}}
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
    title="src/routes/store/new.svelte"
    pattern="new.svelte"
    style="fauna"
/>}}

### View Store

Create a new page to show each store. Create a new file `src/routes/store/[id].svelte` and add the following code. Notice in the following code `findStoreByID` is used to retrieve store information.

{{< tabs groupId="frontend-svelte" >}}
{{< tab name="SvelteKit" >}}
{{< highlight svelte >}}
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

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
    title="src/routes/store/[id].svelte"
    pattern="\[id\].svelte"
    style="fauna"
/>}}

### Edit store

Create a new form component to edit stores. Create a new file `src/lib/EditStore.svelte` and add the following code. 

{{< tabs groupId="frontend-svelte" >}}
{{< tab name="SvelteKit" >}}
{{< highlight svelte >}}
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
    title="src/lib/EditStore.svelte"
    pattern="EditStore.svelte"
    style="fauna"
/>}}

Next, add this component to view store page. Make the following changes to `src/routes/store/[id].svelte` file.

{{< tabs groupId="frontend-svelte" >}}
{{% tab name="Svelte.js" %}}

```svelte {hl_lines=["4","9"]}
// src/routes/store/[id].svelte
<script lang="js">
  ...
  import EditStore from '$lib/EditStore.svelte';

  ...
<div class="uk-container">
  ...
  <EditStore selectedStore={store}/>
</div>

```

{{% /tab %}}
{{< /tabs >}}


## Fine-grained Access Control

Ideally, you only allow the data owner to make any changes. For instance, in this application, only the store owner should update their store information. Fauna allows fine-grained access control. You can set access rules (predicates) so that users can only modify their data and not others.

Head over to the Fauna dashboard. Navigate to *Security > Roles > AuthRole*. Expand the *Store* collection. Choose the code icon (`</>`) underneath *Write* and add the following rules.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda(
  ["oldData", "newData"],
  And(
    Equals(Identity(), Select(["data", "owner"], Var("oldData"))),
    Equals(
      Select(["data", "owner"], Var("oldData")),
      Select(["data", "owner"], Var("newData"))
    )
  )
)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< figure
  src="../../build-with-nextjs/forms-updates/images/add-write-predicate.png" 
  alt="Add write predicate"
>}}

The rule defines that only a store's owner can update that store.  

Similarly, add the following predicate for *Delete*. This rule defines that only a store's owner can delete a store. 

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda("ref", Equals(
  Identity(), // logged in user
  Select(["data", "owner"], Get(Var("ref")))
))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Add a predicate for *Create* as well. The following rule ensures that logged-in users can add store and owner *id* is associated with a store when it is created.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda("values", Equals(Identity(), Select(["data", "owner"], Var("values"))))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Select *Save* to save your access control rules. Now, users can only modify or delete their data from your front end.

In this chapter, you learned how to apply fine-grained access control to your data. In the next chapter, you learn more about custom resolvers and Fauna Query Language (FQL).



#### Complete Code

📙 Get the final code for this section [here](https://github.com/fauna-labs/fauna-shop-sveltekit/tree/main) 
