---
title: "Multi-tenancy in Fauna"
date: 2022-03-20T15:44:53
draft: false
weight: 62
pre: "<b>b. </b>"
---

### Creating child databases for multi-tenancy

Fauna supports multi-tenancy out of the box. You can create many nested child databases inside your Fauna database. Head over to *[Fauna Dashboard](dashboard.fauna.com)* and navigate to your database. 

Navigate to *DB Overview* and select *Create Database* to create a new child database.

{{< figure
  src="./images/create-child-db.png" 
  alt="Create child database"
>}}


{{< figure
  src="./images/new-child-db.png" 
  alt="Create child database"
>}}

### Applying multi-tenancy in the context of the marketplace app

Let's apply the multi-tenancy architecture to the marketplace app from the previous chapter.
In your application for each shop, you can create a new child database where vendor-specific information can live. These child databases contain data you do not want to expose to anyone.

Invoice information, inventory, and tax information would be examples of such data that can live under a specific shop's child database. Creating this separation of concern will keep data isolated. It will be easier to migrate a particular shop's data without affecting the whole application. 

As you put the invoice (buy/sell) data inside the child database, you can gain insight into resource usage by particular vendors (shops).

Create a new schema for your child database. Create a new file `shop.schema.graphql`.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
type Invoice {
  shopId: ID!
  amount: Float!
  payment: Payment!
  customerNo: String!
  createdAt: Date!
}

enum Payment {
  CreditCard,
  DebitCard,
  Paypal,
  Bitcoin
}
```
{{% /tab %}}
{{< /tabs >}}

{{< attachments
      title="Child DB schema"
      pattern="shop.schema-3.1.graphql" 
      style="fauna"
/>}}

Upload this schema to a child database. Run a sample mutation to create a new Invoice. Make sure everything is working as expected.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
mutation {
  createInvoice(data: {
    shopId: "12332"
    amount: 34
    payment: CreditCard
    customerNo: "123332"
    createdAt: "2022-03-21"
  }) {
    _id
    shopId
    createdAt
  }
}
```
{{% /tab %}}
{{< /tabs >}}

Every child database has a security key associated to it. This key allows the application to query the child database. This child database key is saved in the Owner document. Make the following changes to your `schema.graphql` file to save this information.

 {{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
# ...partials of schema.graphql
type Owner {
  name: String!
  email: String! @unique
  stores: [Store]! @relation
  shopdbs: [ShopDB!]
}

# Embeded type for child database
type ShopDB @embedded {
  shopId: String!
  secret: String!
}

...
```
{{% /tab %}}
{{< /tabs >}}


{{< attachments
      title="Updated main schema"
      pattern="main.schema-3.1.graphql" 
      style="fauna"
/>}}


Go to your main database and upload the updated schema. 

In the next section you learn how to programmatically create a child database and a security key for a child database from your front end application.