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

Name your role `UnAuthRole`. Every unauthenticated user who lands in your application will assume this role. Assign `read` and `create` privileges to `Owner` collection. Assign read privilege to findOwnerByEmail index as well.  

> ℹ️ To register a user you need write permission on the `Owner` collection. To log in as a user you need read permission on the `Owner` collection and the `findOwnerByEmail` index as your function finds an owner by their email. 

In the Functions section, add `UserRegistration` and `UserLogin` UDF to this role. Refer back to the [Authentication section]({{< ref "/get-started/user-authentication" >}}) of this workshop to learn how to create these UDFs.

{{< figure
  src="./images/3.png" 
  alt="Add function permission to role"
>}}

Next, navigate to *Security > Keys > New Key*. 

{{< figure
  src="./images/4.png" 
  alt="Create new key"
>}}

In the *new key* form, select your database in the database field. Select `UnauthenticatedClient` in the role selection field. Give a name to your key in the name field. Select *Save* to create the new key.

{{< figure
  src="./images/5.png" 
  alt="Create key form"
>}}

{{< figure
  src="./images/6.png" 
  alt="Generated secrect"
>}}

Copy this secret key. Create a `.env.local` file in the root of your application and add this secret key as an environment variable.

```env
NEXT_PUBLIC_FAUNA_SECRET=fnxxxxxxxxxxxxx
```

Once you update the environment variable, you need to restart your next.js application. 
Add apollo provider to your `_app.js` file. Make the following changes to your `_app.js` file. This will allow you to execute GraphQL queries and mutations from your components.

```jsx
// _app.js

import Head from 'next/head';
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.7.6/dist/css/uikit.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/uikit@3.7.6/dist/js/uikit.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/uikit@3.7.6/dist/js/uikit-icons.min.js" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}

export default MyApp

```
