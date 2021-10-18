---
title: "Setting up the front end application"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 20
pre: "<b>a. </b>"
---


In this section, you learn how to set up your serverless application with Next.js and Fauna. You can download the complete code for this section at the following GitHub link. 

To create a new Next.js app, run the following command in your terminal.

```sh
npx create-next-app fauna-shops
```

Run your Next.js app with the following command to ensure everything is working after the Next CLI scaffolds a new application.

```sh
cd fauna-shop
npm run dev
```

Navigate to [localhost:3000](http://localhost:3000/) in your browser and review the running application.


{{< figure
  src="./images/1.png" 
  alt="Welcome to next.js"
>}}

Next, add apollo client and GraphQL dependencies to your application. Run the following command. 

```sh
npm install @apollo/client graphql
```

With all the dependencies in place, it is time to set up your GraphQL client. Create a new file called `apollo-client.js` in the project's root and add the following code to it.

```jsx
// apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  // Uncomment the appropriate line according to the
  // region group where you created your database.
  uri: 'https://graphql.fauna.com/graphql',
  // uri: 'https://graphql.eu.fauna.com/graphql',
  // uri: 'https://graphql.us.fauna.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_FAUNA_SECRET
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

export default client;
```

{{% notice note %}}
Region groups give you control over where your data resides. To lean more about region group head over to [offical documentation site](https://docs.fauna.com/fauna/current/learn/understanding/region_groups).

{{% /notice %}}

Notice, in the previous code snippet, there is an environment variable called `NEXT_PUBLIC_FAUNA_SECRET`. You ship your client application with a Fauna secret token. This secret token has limited access to Fauna resources. Ideally, your application should only use this secret key to authenticate users. Authenticated users then receive a temporary access token which they can then use to access further resources in Fauna. Let’s go ahead and create this secret key.

First, you need to create a role for your key. A role defines what resources your key can access. Head over to Fauna [dashboard](https://dashboard.fauna.com/) to create a new key. Navigate to *Security > Roles > New Custom Role*.

{{< figure
  src="./images/2.png" 
  alt="Create new role"
>}}

