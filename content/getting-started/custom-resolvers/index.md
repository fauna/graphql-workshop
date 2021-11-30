---
title: "Custom resolvers"
date: 2021-11-30:35:32-04:00
draft: false
weight: 40
pre: "<b>c. </b>"
disableMermaid: false
---

In the previous section, you created a GraphQL service by uploading a schema to Fauna. In this section, you implement the following common data access patterns in Fauna with GraphQL:

## Goals

You are now familiar with two common data access patterns `getById` and `getByAttribute`. You can find a particular document by id or find documents by property. However, what if you want to get all the documents (or first 100 documents). Fauna doesn't auto generate a resolver to list all the documents. Fauna provides you with the flexibility to create your own resolvers and run business logic inside the data layer. Let’s take a look at how you can create a custom resolvers to query all documents.

{{% notice note %}}
💡 *__A resolver is a function that's responsible for populating the data for a single field in your schema.__* *Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source (i.e. Fauna).* - [Apollo GraphQL](http://www.apollographql.com)
{{% /notice %}}


When you create a GraphQL service you create resolver functions in your application layer. In a  typical GraphQL server a resolver function retrieves data from a database, performs the business logic in the application layer and returns a response. The following diagram demonstrates a traditional GraphQL server data flow.

{{< mermaid >}}
sequenceDiagram
    Client-App->>+GraphQL-Server: Client request to GraphQL server
    GraphQL-Server->>+Database: GraphQL server request for data
    Database-->>-GraphQL-Server: Data is returned
    GraphQL-Server-->>-Client-App: GraphQL server runs business logic and returns response 

{{< /mermaid >}}

In every GraphQL server you are querying the data from a database. There is always a slight delay in data retention. In Fauna, there is no application layer. Fauna exposes native GraphQL directly to the client. The resolver functions runs within database layer. You write the resolvers with Fauna's native FQL language. The following diagram demonstrates Fauna's data flow.

{{< mermaid >}}
graph TD
    A[Client Application] --> B(Fauna GraphQL Interface)
    B --> C{Business Logic with FQL resolvers}
    C-->B
    B-->A
{{< /mermaid >}}


Navigate to the *Functions* tab in the dashboard and select *New Function* to create a new UDF. Name your UDF `ListAllOwners`. Copy and paste the following code in the *Function Body* section, and choose *Save* to create your function.

{{< tabs groupId="query-language" >}}
{{% tab name="FQL" %}}
```js
Query(
  Lambda(
    [],
    Map(
      Paginate(
        Documents(Collection("Owner"))
      ),
      Lambda("ref", Get(Var("ref")))
    ),
  )
)
```
{{% /tab %}}
{{< /tabs >}}

{{< figure
  src="./images/11.png" 
  alt="UDF function"
>}}

You can leave the role option as none for now. This causes the UDF to run with the same permissions as the identity that invokes it. You learn more about roles in the [authentication and authorization](/) section. 

Add a new query called `listOwners` to your GraphQL schema. Add the `ListAllOwners` UDF as your `@relation` directive.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
type Query {
  findOwnerByEmail(email: String): [Owner] @relation(name: "OwnerByEmail")
  listOwners: [Owner] @relation(name: "ListAllOwners")
}
```
{{% /tab %}}
{{< /tabs >}}

Replace your old schema with the new one. Review the *Docs* section of your GraphQL playground. Notice a `listOwners` query is added.  

{{< figure
  src="./images/12.png" 
  alt="listOwners query"
>}}

 Run the following query to list all owners.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
{
  listOwners {
    data {
      _id
      name
      email
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs groupId="output-format" >}}
{{% tab name="Result" %}}
```json
{
  "data": {
    "listOwners": {
      "data": [
        {
          "_id": "310939656736735811",
          "email": "shadid@fauna.com"
        },
        {
          "_id": "310939720261567043",
          "email": "john@fauna.com"
        }
      ]
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}


## Review

In this section, you learned

In [the next section]({{< ref "/getting-started/user-authentication" >}}), you learn how to authenticate users and control access to resources using GraphQL and Fauna.

---
[indexes]: https://docs.fauna.com/fauna/current/api/fql/indexes?lang=shell