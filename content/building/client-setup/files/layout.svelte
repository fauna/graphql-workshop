<script>
  import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
  import { setContext } from '@apollo/client/link/context';
  import { setClient } from "svelte-apollo";
  import Cookie from 'js-cookie';
  
  const httpLink = createHttpLink({
    uri: 'https://graphql.fauna.com/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = import.meta.env.VITE_PUBLIC_FAUNA_SECRET
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  setClient(client);

</script>

<slot></slot>