import { createClient } from '@urql/svelte';

/**
  Uncomment the appropriate line according to the
  region group where you created your database.
**/

// const url = 'https://graphql.eu.fauna.com/graphql'
// const url = 'https://graphql.us.fauna.com/graphql'
const url = 'https://graphql.fauna.com/graphql'

export default createClient({
  url,

  fetchOptions: () => {
    const token = import.meta.env.VITE_PUBLIC_FAUNA_KEY;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
}); 

export const clientWithCookieSession = token => createClient({
  url,
  
  fetchOptions: () => {
    console.log('token', token);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});
