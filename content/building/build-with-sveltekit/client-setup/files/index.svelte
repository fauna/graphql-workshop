<script>
  import { setClient, mutation } from '@urql/svelte';
  import client from '../client';
  setClient(client);

  const loginMutation = mutation({
    query: `
      mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          secret
          ttl
        }
      }
    `,
  });
  async function testLogin(e) {
    e.preventDefault();
    const resp = await loginMutation({ email: "shadid12@email.com", password: "123456" })
    console.log(resp.data);
  }
</script>

<div>
  <h3>Login Test</h3>
  <button on:click={testLogin}>Login Test</button>
</div>
