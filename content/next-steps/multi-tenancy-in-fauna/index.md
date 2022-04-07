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

type Product {
  name: String!
  price: Float!
  description: String!
  image: String
}

enum Payment {
  CreditCard,
  DebitCard,
  Paypal,
  Bitcoin
}

type Query {
  allProducts: [Product]
}
```
{{% /tab %}}
{{< /tabs >}}

{{< attachments
      title="Child DB schema"
      pattern="shop.schema-3.1.graphql" 
      style="fauna"
/>}}

Upload this schema to a child database.
Run the following mutation to create a couple of products inside this database.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
mutation CreateProduct {
  createProduct(data: {
    name: "Classic Records Collection Vol 1"
    price: 49.95
    description: "Records from the 90s"
    image: "https://images.unsplash.com/photo-1587731556938-38755b4803a6"
  }) {
    _id
  }
}
```
{{% /tab %}}
{{< /tabs >}}

You require a public key to query this database from your front-end application. Go ahead and create a new role and a security key. 
Head over to _Security > Roles > New Role_ and create a new role. You can name this new role `public`. Give read access to `products` and `allProducts` index.

{{< figure
  src="./images/public_key_1.png" 
  alt="Create role for child database"
>}}

Next, create a key for this new role. Head over to _Security > Keys > New Key_ and create a new key for this role.

{{< figure
  src="./images/new_key.png" 
  alt="Create a new key"
>}}


{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}

You can save this public key inside a `store` document in your parent database. Make the following changes to your parent database schema. 
```gql {hl_lines=["10", "15"]}
# ...partials of schema.graphql
# ...
type Store {
  name: String!
  email: String!
  paymentMethods: [String]
  categories: [String]
  owner: Owner!
  isActive: Boolean
  publicKey: String
}

type Query {
  ...
  allShops: [Store]
}
#...
```
{{% /tab %}}
{{< /tabs >}}

{{< attachments
  title="Child DB schema"
  pattern="main.schema-3.1.graphql" 
  style="fauna"
/>}}

You can add the child database key in a particular store's `publicKey` field. Replace your parent database schema with the updated schema.

Next, select a store document from your parent database's store collection. Select the edit icon to edit a store document. 

{{< figure
  src="./images/update_store_1.png" 
  alt="Select edit icon to update store"
>}}

Add the public key to this store and select save to save the document as shown in the following picture.


{{< figure
  src="./images/update_store.png" 
  alt="Select edit icon to update store"
>}}

When you query a store in your client application, you get that store's child database key along with other information. You can then use the key to interact with the store's dedicated database. 

