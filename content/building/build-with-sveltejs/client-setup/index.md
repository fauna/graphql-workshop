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
$ cd blogApp
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

Next, create a new file `src/client.js` in the root of your application. Add the following code snippet to the file.

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