// apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookie from 'js-cookie';

export const httpLink = createHttpLink({
    uri: 'https://graphql.us.fauna.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const cookies = Cookie.get('fauna-session');
  const token = cookies ? JSON.parse(cookies).secret : process.env.NEXT_PUBLIC_FAUNA_SECRET
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

export const setCustomAuthToken = (token) => setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${token}`
  }
}));

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
