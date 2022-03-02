---
title: "Uploading your schema"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 20
pre: "<b>a. </b>"
---

In this section you learn how to create a database and GraphQL service in Fauna. You learn about the resources that Fauna automatically generates from your GraphQL schema. Finally, you use the GraphQL playground to invoke a mutation and a query.

## Creating your database

Navigate to the [Fauna Dashboard](https://dashboard.fauna.com/) in your browser and create a new database by choosing *Create Database*. Note the options shown in the following screenshot.

1. **Name**: The name of your database, in this case `GraphQL_Workshop`. Database names cannot contain spaces or the *%* character and cannot be *events*, *sets*, *self*, *documents*, or *_* (the underscore character). You can change the name of your database at any time.
1. **Region Group**: The [Region Group][region-groups] where you want to create your database. If you are unsure, choose *Global* as shown in the screenshot. Note that you cannot change the Region Group of a database after creation!
1. **Use demo data**: Whether to populate your database with demo data. Do not select this option for this workshop.
1. **Create**: Choose the *Create* button to create your database.

{{< figure
  src="images/create-database.png" 
  alt="Screen capture showing the 'Create Database' options from the Fauna dashboard."
>}}

## Uploading a GraphQL schema

Create a GraphQL schema with a single type *Store* as shown in the following example.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
type Store {
    name: String!
    email: String!
    paymentMethods: [String]
    categories: [String]
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Save your schema as *schema-1a.graphql* or download a copy using the following link.

{{< attachments
      title="Initial GraphQL schema"
      pattern=".*(graphql)" 
      style="fauna"
/>}}

Navigate to the *GraphQL* tab in the Fauna dashboard, choose *Import Schema*, and select the GraphQL schema you created or downloaded.

{{< figure
  src="images/import-schema.png" 
  alt="Import Schema"
>}}

## Exploring generated GraphQL resources

The GraphQL playground displays after your schema upload completes. Choose the *Docs* tab in the GraphQL playground and notice that Fauna automatically generates the following queries and mutations based on your schema.

* *findStoreById*
* *createStore*
* *updateStore*
* *deleteStore*

{{< figure
  src="images/graphql-playground-docs-tab.png"
  alt="GraphQL playground docs tab"
>}}

Navigate to the *Collections* tab in the Fauna dashboard and notice that Fauna also generates a *Store* collection for you based on the *Store* type you define in your schema. Your *Store* collection should be empty.

{{< figure
  src="images/user-collection.png"
  alt="GraphQL playground docs tab"
>}}

## Calling mutations and queries

Your GraphQL backend is ready to store and retrieve data! Return to the *GraphQL* tab and create a new store by running the following mutation in the playground. 

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
mutation {
  createStore(data: {
    name: "Fauna Labs"
    email: "owner@fauna-labs.com"
    paymentMethods: ["Fauna bucks", "Credit Card"]
    categories: ["Software and Internet"]
  }) {
    _id
    name
    email
    paymentMethods
    categories
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "createStore": {
      "_id": "316700907109614160",
      "name": "Fauna Labs",
      "email": "owner@fauna-labs.com",
      "paymentMethods": [
        "Fauna bucks",
        "Credit Card"
      ],
      "categories": [
        "Software and Internet"
      ]
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Return to the *Collections* tab, choose the *Store* collection, and expand the new store document. Copy the *id* to use in the next step. The *id* is the string enclosed in quotes highlighted in the following screenshot.

{{< figure
  src="images/user-collection-with-store.png" 
  alt="Store collection with a single document"
>}}

Next, use a generated query to find your new store by its *id*. Return to the *GraphQL* tab and paste the following query into your GraphQL playground, replacing the *<store-id>* placeholder with the *id* you copied previously.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
query {
  findStoreByID(id: "<store-id>") {
    _id
    name
    email
    paymentMethods
    categories
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "findStoreByID": {
      "_id": "<store-id>",
      "name": "Fauna Labs",
      "email": "owner@fauna-labs.com",
      "paymentMethods": [
        "Fauna bucks",
        "Credit Card"
      ],
      "categories": [
        "Software and Internet"
      ]
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Review

In this section you learned how to create a database and upload a GraphQL schema using Fauna. You explored the mutations, queries, and collections that Fauna automatically generates from a GraphQL schema. Finally, you used the GraphQL playground to invoke a mutation and a query.

In [the next section]({{< ref "/getting-started/data-access-patterns" >}}), you learn about various data access patterns and how to create custom resolvers in Fauna.

---

[region-groups]: https://docs.fauna.com/fauna/current/learn/understanding/region_groups