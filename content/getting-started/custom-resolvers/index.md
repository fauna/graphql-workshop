---
title: "Custom resolvers"
date: 2021-11-30:35:32-04:00
draft: false
weight: 40
pre: "<b>c. </b>"
disableMermaid: false
---

In the previous section, you implemented common access patterns in Fauna with GraphQL. In this section, you learn how GraphQL resolvers work and create a custom resolver using a [user-defined function (UDF)][udf] and the [*@resolver*][resolver] directive in Fauna.

## GraphQL resolvers

In the previous section you learned that Fauna can automatically generate a resolver to list all documents of a given type. Fauna also provides you with the flexibility to create your own resolvers and run custom business logic inside the data layer.

According to [Apollo GraphQL][resolver-definition]:

> **A resolver is a function that's responsible for populating the data for a single field in your schema.** Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source.

When using Fauna, the function is a UDF, and the data source is Fauna.


When you create any GraphQL service you create resolver functions in your application layer. In a typical GraphQL server, a resolver function retrieves data from a database, performs custom business logic in the application layer, and returns a response. The following diagram demonstrates this traditional GraphQL server data flow.

{{< mermaid >}}
sequenceDiagram
    Client-App->>+GraphQL-Server: Client request to GraphQL server
    GraphQL-Server->>+Database: GraphQL server request for data
    Database-->>-GraphQL-Server: Data is returned
    GraphQL-Server-->>GraphQL-Server: Custom business logic
    GraphQL-Server-->>-Client-App: Return response 
{{< /mermaid >}}

In other GraphQL servers you query data from a database, which introduces a slight delay in the response. In Fauna, there is no application layer. Instead, Fauna exposes its GraphQL interface directly to the client. You write your resolvers as UDFs using Fauna's native [Fauna Query Language (FQL)][fql] and your resolver functions run directly in the database layer.

The following diagram demonstrates the same data flow when implemented with Fauna.

{{< mermaid >}}
sequenceDiagram
    Client-App->>+Fauna: Client request to Fauna GraphQL server
    Fauna->>+Fauna: Load data performing custom business logic
    Fauna-->>-Client-App: Return response
{{< /mermaid >}}

## Creating a user-defined function (UDF)

Navigate to the *Functions* tab in the Fauna dashboard and choose *New Function* to create a new UDF. 

{{< figure
  src="./images/create-function.png" 
  alt="Creating a user-defined function."
>}}

1. Name your UDF *GetStoreCount*.
1. Leave the role as *None* for now. This causes the UDF to run with the same permissions as the identity that invokes it. You learn more about roles in the [User authentication]({{< ref "/getting-started/user-authentication" >}}) section. 
1. Copy and paste the following code in the *Function Body* section then choose *Save* to create your function.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Query(
  Lambda(
    [],
    Count(Documents(Collection("Store")))
  )
)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="CountStores UDF"
      pattern="CountStores.fql"
      style="fauna"
/>}}

{{% notice note %}}
UDFs are written in the Fauna Query Language (FQL) - the functional programming language at the heart of Fauna. FQL supports function composition, so you can compose complex expressions from simpler components.
{{% /notice %}}

### Anatomy of a UDF

The *Query(Lambda(...))* wrapper is required for all UDFs.

* [*Query*][fql-query] lets Fauna know that you are defining a UDF that will be invoked at some future point and *not* invoking it immediately.
* [*Lambda*][fql-lambda] defines an anonymous function. 

*Lambda* takes two arguments.
* A single variable or array of variables. In this case, your UDF does not accept any variables, so you define an empty array.
* The body of the UDF, written as a valid FQL expression. The FQL expression in this UDF counts the number of documents in the "Store" collection. 

{{% notice warning %}}
Note: Count requires an index scan which runs in O(n) time. Do not call use this approach in production workloads!
{{% /notice %}}

Update your schema to add a *countStores* query using the *@resolver* directive to invoke the *GetStoreCount* UDF or download the linked schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql "hl_lines=5" >}}
type Query {
  findOwnerByEmail(email: String): [Owner] @relation(name: "OwnerByEmail")
  listOwners: [Owner]
  # Add the following line
  countStores: Int @resolver(name: "GetStoreCount")
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Count stores with custom resolver"
      pattern="schema-1c-1.graphql"
      style="fauna"
/>}}

Replace your schema and review the *Docs* section of your GraphQL playground. Notice the new *countStores* query that appears.

{{< figure
  src="./images/graphql-docs-tab-countStores.png" 
  alt="countStores query"
>}}

Run the following query to count how many stores have been created in your application.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql  >}}
query {
  countStores
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "countStores": 1
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Review

In this section, you learned how GraphQL resolvers work and created a custom resolver using a UDF in Fauna.

In [the next section]({{< ref "/getting-started/user-authentication" >}}), you learn how to authenticate users and control access to resources using GraphQL and Fauna.

---
[fql-count]: https://fauna.link/fql-count
[fql-lambda]: https://fauna.link/fql-lambda
[fql-query]: https://fauna.link/fql-query
[resolver]: https://docs.fauna.com/fauna/current/api/graphql/directives/d_resolver
[resolver-definition]: https://www.apollographql.com/docs/tutorial/resolvers/
[udf]: https://docs.fauna.com/fauna/current/api/graphql/functions
