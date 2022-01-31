---
title: "Client setup"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 21
pre: "<b>a. </b>"
disableMermaid: false
---

In this section, you learn how to set up your fullstack serverless application with Fauna. 

<!-- You can find the complete code for this section [on GitHub][github-commit-2a]. -->

## Creating your app

To create a new fullstack serverless app, run the following command in your terminal.

{{< tabs groupId="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight console >}}
$ npm init next-app fauna-shop --use-npm
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Run your app to ensure everything is working correctly before making any changes.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight console >}}
$ cd fauna-shop
$ npm run dev
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Navigate to [http://localhost:3000](http://localhost:3000/) in your browser and review the running application.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< figure
  src="./images/welcome-to-nextjs.png" 
  alt="Welcome to Next.js"
>}}
{{< /tab >}}
{{< /tabs >}}

## Installing dependencies

Run the following command to add the [Apollo GraphQL client][apollo-client] and GraphQL dependencies to your application.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight console >}}
$ npm install @apollo/client graphql
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Configuring your GraphQL client

Create a new file called `apollo-client.js` in the project's root with the following code.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Apollo Client"
      pattern="apollo-client.js" 
      style="fauna"
/>}}

{{% notice note %}}
Region groups give you control over where your data resides. You choose the Region Group for your application when you create your database in the first chapter. To learn more about Region Groups visit the [documentation](https://docs.fauna.com/fauna/current/learn/understanding/region_groups).
{{% /notice %}}

## Authenticating in the front-end

In the previous code snippet, there is an environment variable called *NEXT_PUBLIC_FAUNA_SECRET*. You ship your client application with a Fauna secret that allows limited access to Fauna resources. A suggested practice is to limit this key to registering and authenticating users. Authenticated users then receive temporary access tokens when they login that grant access to additional resources.

### Creating a front-end role

First, create a role that only has permissions to call the *RegisterUser* and *LoginUser* functions you created in the [User authentication]({{< ref "/getting-started/user-authentication">}}) section of the first chapter. 

Navigate to the *Security* section of the [Fauna dashboard][fauna-dashboard] and choose *Roles* then *New Custom Role*.

{{< figure
  src="./images/creating-new-role.png"
  alt="Creating a new role"
>}}

1. Name your role `FrontEndRole`.
1. In the Functions section, add the *RegisterUser* and *LoginUser* UDFs to this role.
1. Ensure that *Call* permissions are selected for both functions.
1. Choose *Save* to create the role.

{{< figure
  src="./images/front-end-role.png" 
  alt="Adding function call permissions to role"
>}}

### Creating roles for your UDFs

#### *RegisterUser*

When you invoke a UDF that does not have its own role, the UDF runs with the same permissions as the identity that invoked it. In the first section, you invoke your UDFs from the *Shell* and *GraphQL* sections of the dashboard. When you are in the dashboard, commands you invoke are run with *admin* permissions by default.

The key that you create for your front-end application only has permission to invoke the *RegisterUser* and *LoginUser* UDFs, but the UDFs need permission to create and read documents in the *Owner* collection. You do not want to give these permissions directly to the front-end role. Instead, create tightly-scoped roles for each UDF.

Return to the *Security* section of the dashboard and create another new role. 

1. Name this role `RegisterUserUDF`.
1. Select the *Owner* collection.
1. Ensure *Create* permissions are provided, and choose *Save* to create the new role.

{{< figure
  src="./images/register-user-permissions.png" 
  alt="Permissions for the RegisterUserUDF role"
>}}

Navigate to the *Functions* section, select the *RegisterUser* UDF, and update the role to use the new *RegisterUserUDF* role.

{{< figure
  src="./images/update-register-user-role.png" 
  alt="Updating the role for the RegisterUser UDF"
>}}

Navigate to the *Shell* and test your UDF by using the *Run As* feature to invoke the UDF as *FrontEndRole*.

{{< figure
  src="./images/run-as-frontend-role.png" 
  alt="Invoking a UDF using the \"Run As\" feature"
>}}

To use the *Run As* feature, copy the following query, paste it into the web shell, select *FrontEndRole* from the *Run As* menu, and choose *Run Query As* to invoke your UDF.

{{< tabs groupId="fauna-shell" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Call(
  "RegisterUser",
  // ["email", "password", "name"]
  ["security@fauna-labs.com", "qZXUEhaNdng9", "Improved Security"]
)
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight js >}}
{
  ref: Ref(Collection("Owner"), "317182757128110665"),
  ts: 1638747899080000,
  data: {
    email: "security@fauna-labs.com",
    name: "Improved Security"
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

#### *LoginUser*

Create another new role named `LoginUserUDF`. The *LoginUser* UDF needs permission to read from the *findOwnerByEmail* index to locate the correct user and to read from the *Owner* collection to compare the hashed credentials for that user.

{{< figure
  src="./images/login-user-permissions.png" 
  alt="Updating the role for the LoginUser UDF"
>}}

Navigate to the *Functions* section and update the role of your *LoginUser* UDF to use the new *LoginUserUDF* role. Return to the *Shell* and test the UDF, again using *Run As* to invoke the UDF as the *FrontEnd* role.

{{< tabs groupId="fauna-shell" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Call(
  "LoginUser",
  // ["email", "password"]
  ["security@fauna-labs.com", "qZXUEhaNdng9"]
)
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight js >}}
{
  secret: "<token>",
  ttl: Time("2021-12-06T00:56:46.768682Z"),
  email: "security@fauna-labs.com"
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Creating a front-end key

Now that your roles and UDFs are working correctly, create a front-end key to store in your application. Navigate to the *Security* section and choose *New Key*.

1. Confirm that your database is selected in the *Database* field.
1. Select *FrontEndRole* in the role selection field.
1. Name your key.
1. Choose *Save* to create the new key.

{{< figure
  src="./images/creating-a-front-end-key.png" 
  alt="Creating a front-end key"
>}}

Copy the secret key to use in the next step.

{{% notice warning %}}
The secret key cannot be displayed once you navigate away from this page! If you lose a key, you can create a new key with the same role and revoke the old key.
{{% /notice %}}

### Storing the key in your client

Create a `.env.local` file in the root of your application and add this secret key as an environment variable.

{{< tabs groupId="shell" >}}
{{< tab name="Shell" >}}
{{< highlight text >}}
NEXT_PUBLIC_FAUNA_SECRET=fnxxxxxxxxxxxxx
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Restart your Next.js application after updating the environment variable.

## Adding an *ApolloProvider* for Fauna

Adding an *ApolloProvider* for Fauna allows you to execute GraphQL queries and mutations from your components. To add an *ApolloProvider*, replace the contents of *pages/_app.js* with the following code. 

{{< tabs groupId="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="pages/_app.js"
      pattern="_app.js" 
      style="fauna"
/>}}

Replace the contents of `pages/index.js` with the following code. Make sure to use a valid *username* and *password* for a registered user. If you haven't registered any users yet refer back to the [Authentication section]({{< ref "/getting-started/user-authentication" >}}) for instructions on signing up a new user.

{{< tabs groupId="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import styles from '../styles/Home.module.css'
import { useMutation, gql } from "@apollo/client";

const LOGIN = gql`
  mutation OwnerLogin($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      ttl
      secret
      email
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
          email: 'security@fauna-labs.com',
          password: 'qZXUEhaNdng9',
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="pages/index.js"
      pattern="index.js" 
      style="fauna"
/>}}

Run your application with the following command.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight console >}}
$ npm run dev
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Navigate to [localhost:3000](http://localhost:3000/) and open your browser's developer tools to the *Console* tab. Choose the *Login* button. You should see the response from the *login* mutation in the console!

{{< figure
  src="./images/console-login-response.png" 
  alt="Login response"
>}}

## Review

In this session, you configured Fauna to perform user authentication with least privileged access and connected your front-end application to Fauna.

In [the next section]({{< ref "authentication" >}}), you implement client-side user registration and login forms for your application.


#### Complete Code

📙 Get the final code for this section [here](https://github.com/fauna-labs/fauna-shop-nextjs/tree/2.a) 


---
[fauna-dashboard]: https://dashboard.fauna.com