---
title: "Auto-generated resolvers"
date: 2021-11-30:35:32-04:00
draft: false
weight: 60
pre: "<b>e. </b>"
disableMermaid: false
---

In the previous section, you learned how to use custom resolvers to authenticate users and manage access to documents. In this section, you learn how to automatically generate [user-defined functions (UDFs)][udf] for CRUD operations on simple GraphQL types in Fauna.

## Auto-generated UDF resolvers

In [*Uploading your schema*]({{< ref "/getting-started/uploading-your-schema" >}}) you learned that Fauna automatically generates queries and mutations for types you specify in your schema. You can generate UDFs for these resolvers by adding the `@generateUDFResolvers` directive to the type definitions in your schema.

Auto-generated UDF resolvers are only available for simple types, that is, types that do not have relations. Add the following *Category* type to your schema with the `@generateUDFResolvers` directive.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql "hl_lines=1" >}}
type Category @generateUDFResolvers {
    name: String!
    description: String!
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Schema with auto-generated UDFs"
      pattern="schema-1e-1.graphql"
      style="fauna"
/>}}

Return to the *GraphQL* section of the Fauna dashboard and replace your schema with the updated schema.

Navigate to the *Functions* section of the Fauna dashboard and notice that Fauna has created five new UDFs for you:

* *createCategory* - Creates a new *Category* with the information you specify.
* *deleteCategory* - Deletes a *Category* with the specified ID.
* *findCategoryByID* - Returns the information for a *Category* with the specified ID.
* *listCategory* - Returns a paginated list of all *Category* objects.
* *updateCategory* - Updates the information for a *Category* with the specified ID.

{{< figure
  src="./images/auto-resolvers.png"
  alt="Five new user-defined functions"
>}}

Each UDF is associated with the GraphQL query or mutation of the same name. For example, the *listCategory* UDF shown in the previous image is the implementation of the *listCategory* GraphQL query.

{{% notice note %}}
The *listCategory* UDF and GraphQL query demonstrate how to handle pagination in custom resolvers.
{{% /notice %}}

## Changing auto-generated UDF resolvers

Once you have generated UDFs, you can change the behavior of a GraphQL query or mutation by editing the relevant UDF. For example, you can modify the *listCategory* UDF to return only the *Categories* that were created by a specific user, or are not "soft deleted."

{{% notice warning %}}
Do not change the parameters or the shape of the return value of a UDF. If you do, the associated GraphQL query or mutation will fail due to type checks!
{{% /notice %}}

## Removing auto-generated UDF resolvers

If you want to return to using Fauna's auto-generated queries and mutations, you can remove the auto-generated UDF resolvers by removing the `@generateUDFResolvers` directive from the type definition in your schema. For example, to remove the connection to the auto-generated resolvers for the *Category* type, update the type definition in your schema as follows.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql "hl_lines=1" >}}
type Category {
    name: String!
    description: String!
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Schema with removed auto-generated UDFs"
      pattern="schema-1e-2.graphql"
      style="fauna"
/>}}

Return to the *GraphQL* section of the Fauna dashboard and replace your schema with the updated schema. Navigate to the *Functions* section of the Fauna dashboard and notice that the five auto-generated UDFs remain, but they are no longer connected to your GraphQL queries and mutations. You can safely remove these UDFs.

## Review

In this section, you learned how to automatically generate user-defined functions (UDFs) for CRUD operations on simple GraphQL types in Fauna.

Congratulations! You have completed the first chapter of this workshop, *Getting started with Fauna*.

In the next chapter, [*Building with Fauna*]({{< ref "/building" >}}), you apply what you have learned so far to build a fullstack serverless web app with Fauna, GraphQL, and [Next.js][next.js] or [SvelteKit][sveltekit].

---
[next.js]: https://nextjs.org
[sveltekit]: https://kit.svelte.dev/
[udf]: https://docs.fauna.com/fauna/current/api/graphql/functions
