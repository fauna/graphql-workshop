---
title: "Client setup"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 20
pre: "<b>a. </b>"
---


In this section, you learn how to set up your serverless application with Next.js and Fauna. You can download the complete code for this section at the following GitHub link. 

To create a new Next.js app, run the following command in your terminal.

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```sh
npx create-next-app fauna-shops
```
{{% /tab %}}
{{< /tabs >}}

Run your Next.js app with the following command to ensure everything is working after the Next CLI scaffolds a new application.

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```sh
cd fauna-shop
npm run dev
```
{{% /tab %}}
{{< /tabs >}}

Navigate to [localhost:3000](http://localhost:3000/) in your browser and review the running application.


{{< figure
  src="./images/1.png" 
  alt="Welcome to next.js"
>}}

Next, add apollo client and GraphQL dependencies to your application. Run the following command. 

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```sh
npm install @apollo/client graphql
```
{{% /tab %}}
{{< /tabs >}}

With all the dependencies in place, it is time to set up your GraphQL client. Create a new file called `apollo-client.js` in the project's root and add the following code to it.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
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
{{% /tab %}}
{{< /tabs >}}

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

In the Functions section, add `UserRegistration` and `UserLogin` UDF to this role. Refer back to the [Authentication section]({{< ref "/getting-started/user-authentication" >}}) of this workshop to learn how to create these UDFs.

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

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```env
NEXT_PUBLIC_FAUNA_SECRET=fnxxxxxxxxxxxxx
```
{{% /tab %}}
{{< /tabs >}}

Once you update the environment variable, you need to restart your next.js application. 
Add apollo provider to your `_app.js` file. Make the following changes to your `_app.js` file. This will allow you to execute GraphQL queries and mutations from your components.

> 💡  You can add the following css styles to to your `_app.js` to make sure your application has a certain look and feel to it. Feel free to use custom css or a css framework of your choice.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
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
{{% /tab %}}
{{< /tabs >}}

Replace the contents of `pages/index.js` with the following code. Make sure to use a valid `username` and `password`. If you don't have a user registered refere back to the [Authentication section]({{< ref "/getting-started/user-authentication" >}}) to signup a new user.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
import styles from '../styles/Home.module.css'
import { useMutation, gql } from "@apollo/client";


const LOGIN = gql`
  mutation OwnerLogin($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      ttl
      secret
      email
      ownerID
    }
  }
`;


export default function Home() {

  const [loginFunc, { data, loading, error }] = useMutation(LOGIN)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const doLogin = e => {
    e.preventDefault();
    loginFunc({
        variables: {
          email: 'johndoe@email.com',
          password: 'pass123456'
        }
    })
    .then(resp => console.log('==>', resp))
    .catch(e => console.log(e))   
  }

  return (
    <div className={styles.container}>
      <button onClick={doLogin}>Login</button>
    </div>
  )
}

```
{{% /tab %}}
{{< /tabs >}}

Run your application with the following command.

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```sh
npm run dev
```
{{% /tab %}}
{{< /tabs >}}

Navigate to [localhost:3000](http://localhost:3000/) and select login button. Observe the network tab in your browser. 

{{< figure
  src="./images/7.png" 
  alt="Login response"
>}}

You have successfully configured your next application with your Fauna backend. You can get the complete code for this section at this link. Head over to the next section to learn about client-side user authentication. 
