---
title: "Client setup"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 31
pre: "<b>a. </b>"
disableMermaid: false
---

In this section, you learn how to set up your fullstack serverless application with Fauna. 

## Creating your app

Run the following command in your terminal to create a new Svelte application. 

{{< tabs groupId="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight console >}}
$ npm init svelte@next fauna-shop
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The Svelte CLI gives you some options to customize our application. Choose the following options.

`✔ Which Svelte app template? › Skeleton project`

`✔ Use TypeScript? … No`

`✔ Add ESLint for code linting?  Yes`

`✔ Add Prettier for code formatting? Yes`

Run the newly created application with the following command.

{{< tabs groupId="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight console >}}
$ cd fauna-shop
$ npm i
$ npm run dev
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Navigate to [http://localhost:3000](http://localhost:3000/) in your browser and review the running application.

{{< tabs groupId="framework" >}}
{{< tab name="Svelte.js" >}}
{{< figure
  src="./images/welcome-to-svelte.png" 
  alt="Welcome to Next.js"
>}}
{{< /tab >}}
{{< /tabs >}}

### Setting up Svelte GraphQL client

here are many popular libraries that you can use to consume GraphQL in Svelte. The `@urql/svelte` library is one of the most popular ones. This workshop uses `@urql/svelte` library as GraphQL client.

Run the following command to add the library in your project.

{{< tabs groupID="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight console >}}
$ npm i @urql/svelte graphql --save
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Next, create a new file `src/client.js` in your application. Add the following code snippet to the file.

{{< tabs groupID="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}

import { createClient } from '@urql/svelte';

export default createClient({
  
  /**
    Uncomment the appropriate line according to the
    region group where you created your database.
  **/

	//url: https://graphql.eu.fauna.com/graphql
  //url: https://graphql.us.fauna.com/graphql

  url: `https://graphql.fauna.com/graphql`,

  fetchOptions: () => {
    const token = import.meta.env.VITE_PUBLIC_FAUNA_KEY;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
}); 

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
    title="Svelte Client"
    pattern="svelte-client.js" 
    style="fauna"
/>}}

{{% notice note %}}
Region groups give you control over where your data resides. You choose the Region Group for your application when you create your database in the first chapter. To learn more about Region Groups visit the [documentation](https://docs.fauna.com/fauna/current/learn/understanding/region_groups).
{{% /notice %}}

## Authenticating in the front-end

In the previous code snippet, there is an environment variable called *VITE_PUBLIC_FAUNA_KEY*. You ship your client application with a Fauna secret that allows limited access to Fauna resources. A suggested practice is to limit this key to registering and authenticating users. Authenticated users then receive temporary access tokens when they login that grant access to additional resources.

### Creating a front-end role

First, create a role that only has permissions to call the *RegisterUser* and *LoginUser* functions you created in the [User authentication]({{< ref "/getting-started/user-authentication">}}) section of the first chapter. 

Navigate to the *Security* section of the [Fauna dashboard][fauna-dashboard] and choose *Roles* then *New Custom Role*.

{{< figure
  src="../../build-with-nextjs/client-setup/images/creating-new-role.png"
  alt="Creating a new role"
>}}

1. Name your role `FrontEndRole`.
1. In the Functions section, add the *RegisterUser* and *LoginUser* UDFs to this role.
1. Ensure that *Call* permissions are selected for both functions.
1. Choose *Save* to create the role.

{{< figure
  src="../../build-with-nextjs/client-setup/images/front-end-role.png" 
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
  src="../../build-with-nextjs/client-setup/images/register-user-permissions.png" 
  alt="Permissions for the RegisterUserUDF role"
>}}

Navigate to the *Functions* section, select the *RegisterUser* UDF, and update the role to use the new *RegisterUserUDF* role.

{{< figure
  src="../../build-with-nextjs/client-setup/images/update-register-user-role.png" 
  alt="Updating the role for the RegisterUser UDF"
>}}

Navigate to the *Shell* and test your UDF by using the *Run As* feature to invoke the UDF as *FrontEndRole*.

{{< figure
  src="../../build-with-nextjs/client-setup/images/run-as-frontend-role.png" 
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
  src="../../build-with-nextjs/client-setup/images/login-user-permissions.png" 
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
  src="../../build-with-nextjs/client-setup/images/creating-a-front-end-key.png" 
  alt="Creating a front-end key"
>}}

Copy the secret key to use in the next step.

{{% notice warning %}}
The secret key cannot be displayed once you navigate away from this page! If you lose a key, you can create a new key with the same role and revoke the old key.
{{% /notice %}}

### Storing the key in your client

Create a `.env` file in the root of your application and add this secret key as an environment variable.

{{< tabs groupId="shell" >}}
{{< tab name="Shell" >}}
{{< highlight text >}}
VITE_PUBLIC_FAUNA_KEY=fnxxxxxxxxxxxxx
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Restart your Svelte application after updating the environment variable.

Run your application with the following command.

{{< tabs groupID="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight console >}}
$ npm run dev
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Testing out the login functionality

Open the `src/routes/index.svelte` in your code and add the following code. In the following code snippet, you have a simple button to test the login functionality. When the button is selected, it fires the `login` mutation.

If you haven't registered any users yet refer back to the [Authentication section]({{< ref "/getting-started/user-authentication" >}}) for instructions on signing up a new user.


{{< tabs groupId="framework" >}}
{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}
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


{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}


{{< attachments
    title="src/routes/index.svelte"
    pattern="index.svelte" 
    style="fauna"
/>}}

Navigate to [localhost:3000](http://localhost:3000/) and open your browser's developer tools to the *Console* tab. Choose the *Login* button. You should see the response from the *login* mutation in the console!

{{< figure
  src="../../build-with-nextjs/client-setup/images/console-login-response.png" 
  alt="Login response"
>}}

## Review

In this session, you configured Fauna to perform user authentication with least privileged access and connected your front-end application to Fauna.

In [the next section]({{< ref "authentication" >}}), you implement client-side user registration and login forms for your application.

---
[fauna-dashboard]: https://dashboard.fauna.com