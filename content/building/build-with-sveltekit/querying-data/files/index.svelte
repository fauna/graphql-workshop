// src/routes/index.svelte
<script>
  import { operationStore, query, setClient } from '@urql/svelte';
	import {clientWithCookieSession} from '../client';
  import Cookie from 'js-cookie';

  const cookies = Cookie.get('fauna-session');

  const { email, secret} = cookies ? JSON.parse(cookies) : {};
  setClient(clientWithCookieSession(secret));

  const findCurrentOwner = operationStore(`
    query findbyEmail($email: String!) {
      findOwnerByEmail(email: $email) {
        _id
        name
        email
        stores {
          data {
            _id
            name
          }
        }
      }
    }
  `,
  {
    email,
  },
  { requestPolicy: 'network-only' }
  );
  query(findCurrentOwner);
</script>

<div class="uk-container wrap">
  {#if !cookies}
    <p>
      You are not Loged in.
    </p>
    <a href="/login">Login</a>
  {/if}

  {#if $findCurrentOwner.data}
    <h4>{$findCurrentOwner.data.findOwnerByEmail.name}</h4>
    <div><b>Email:</b> {$findCurrentOwner.data.findOwnerByEmail.email}</div>
    <ul class="uk-list uk-list-large uk-list-striped">
      {#each $findCurrentOwner.data.findOwnerByEmail.stores.data as store}
      <li>
        <div class="container">
          <div>{store.name}</div>
          <p uk-margin>
            <a href="/store/{store._id}">View</a>
          </p>
        </div>
      </li>
      {/each}
    </ul>
  {/if}

</div>

<style>
  .wrap {
    max-width: 350px;
  }
</style>

