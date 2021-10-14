---
title: "Uploading your schema"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 1
pre: "<b>a. </b>"
---

{{< attachments
      title="Files for this section" 
      pattern=".*(graphql)" 
      style="fauna"
/>}}

Create a simple GraphQL schema with only one type. Refer to the following example. Save your schema as `schema.graphql`.

```gql
# schema.graphql

type Store {
    name: String!
    email: String!
    paymentMethods: [String]
    categories: [String]
}
```

Head over to [Fauna Dashboard](https://dashboard.fauna.com/). Create a new database by selecting Create Database.

{{< figure
  src="images/ch.png" 
  alt="create new database"
>}}

Select GraphQL from the dashboard menu. Notice that there is an option to import your GraphQL schema. Select Import Schema and upload the GraphQL schema file you created.

{{< figure
  src="images/import.png" 
  alt="Import Schema"
>}}

Once the schema is uploaded, the GraphQL playground will initiate. Navigate to the Docs section of GraphQL playground. Notice that Fauna has auto-generated some basic queries and mutations based on your schema.


{{< figure
  src="images/3.png" 
  alt="GraphQL playground docs tab"
>}}

Your GraphQL backend is ready. Create a new store by running the following mutation in the playground. 

```gql
mutation {
  createStore(data: {
    name: "Bed and Bath 24"
    email: "becky@email.com"
    paymentMethods: ["Paypal", "Credit Card"]
    categories: ["Bed & Bath"]
  }) {
    _id
    name
    email
    paymentMethods
    categories
  }
}
```
Navigate to *Collections* and review the `Store` Collection and the store document you created.

{{< figure
  src="images/4.png" 
  alt="Collection and Documents"
>}}

Let's go and find a store by its id. Write the following query into your GraphQL playground. Make sure to replace the *<store-id>* placeholder with an _id of a document in store collection.

```gql
{
  findStoreByID(id: "<store-id>") {
    _id
    name
    email
    paymentMethods
    categories
  }
}
```
It returns a response simmilar to following.

```json
{
  "data": {
    "findStoreByID": {
      "_id": "311680702751965764",
      "name": "Forever 23",
      "email": "forever23@email.com",
      "paymentMethods": [
        "Paypal",
        "Credit Card"
      ],
      "categories": [
        "Clothes",
        "Accessories"
      ]
    }
  }
}
```

That’s about it for this section. In the next [section]({{< ref "/get-started/data-access-patterns" >}}), you learn about various data access patterns and how to create custom resolvers in Fauna.