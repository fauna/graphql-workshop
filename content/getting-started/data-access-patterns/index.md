---
title: "Data access patterns"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 30
pre: "<b>b. </b>"
disableMermaid: false
---

In the previous section, you created a GraphQL service by uploading a schema to Fauna. In this section, you implement the following common data access patterns in Fauna with GraphQL:

* [Finding an owner by ID]({{< relref "#finding-an-owner-by-id" >}})
* [Finding an owner by email]({{< relref "#finding-an-owner-by-email" >}})
* [Get all owners]({{< relref "#get-all-owners" >}})

## Application overview

The following entity relationship diagram (ERD) depicts a simplified multi-vendor e-commerce application (similar to Shopify).

{{< mermaid >}}
erDiagram
    OWNER ||--O{ STORE : manages
    OWNER {
        string name
        string email
        reference stores
    }
    STORE {
        string name
        string paymentMethods
        string categories
        string email
        reference owner
    }
{{< /mermaid >}}

The application database contains collections for both owners and stores. Each owner can manage multiple stores and every store belongs to exactly one owner. This is a classic example of a [one-to-many relationship][one-to-many].

You can implement this database using the following GraphQL schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
type Owner {
    name: String!
    email: String! @unique
    stores: [Store]! @relation
}

type Store {
    name: String!
    email: String!
    paymentMethods: [String]
    categories: [String]
    owner: Owner!
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

You can copy and paste this schema or download a copy using the following link.

{{< attachments
      title="Add the Owner type"
      pattern="schema-1b-1.graphql" 
      style="fauna"
/>}}

## Updating your schema

Navigate to the *GraphQL* section of the Fauna dashboard, choose *Replace Schema*, and select the new schema to upload. 

{{% notice info %}}
When you choose *Replace Schema* you receive the following warning stating *“underlying data may no longer work with existing queries”*. You can choose *Replace* and ignore this warning for the duration of this tutorial.
{{% /notice %}}

{{< figure
  src="./images/replace-schema-warning.png" 
  alt="Schema replacement warning message"
>}}

When the upload completes, open the *Docs* tab and notice that Fauna autogenerates four additional queries and mutations for the *Owner* entity.

* *findOwnerById*
* *createOwner*
* *updateOwner*
* *deleteOwner*

Return to the *Collections* section of the dashboard and verify that Fauna creates an additional collection, *Owner*.

Navigate to the *Indexes* section of the dashboard. Notice that Fauna creates two new [indexes][indexes] based on the relationship you define in your GraphQL schema: *owner_stores_by_owner* and *unique_Owner_email*. 

{{< figure
  src="./images/indexes.png" 
  alt="Indexes"
>}}

The *unique_Owner_email* index is used to ensure that a single email address can only be used to register one account.

The *owner_stores_by_owner* index defines the one-to-many relationship between *Owners* and *Stores*. If you are familiar with SQL databases, you can think of this index as a foreign key join that allows you to specify an *Owner* and retrieve all of the *Stores* managed by that *Owner*.

## Populating related data

Run the following mutation in the GraphQL playground to create a new *Owner*.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
mutation {
  createOwner(data: {
    name: "Fauna Owner"
    email: "owner@fauna-labs.com"
  }) {
    _id
    email
    name
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "createOwner": {
      "_id": "316712661568979536",
      "email": "owner@fauna-labs.com",
      "name": "Fauna Owner"
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Copy the value of *_id* to use when creating a *Store* in the next step.

{{% notice tip %}}
You can use the plus tab in the GraphQL playground to open multiple tabs. This allows you to keep query and mutation results open to return to later.
{{% /notice %}}

{{< figure
  src="./images/graphql-playground-plus-tab.png" 
  alt="GraphQL Playground plus tab for reviewing multiple queries and mutations."
>}}

Create a new store by running the following mutation. In the owner field reference the owner you create in the previous mutation by replacing *<owner-id>* with the value of *_id* that your mutation returns.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
mutation {
  createStore(data: {
    name: "Fauna Swag Shop"
    email: "swag@fauna-labs.com"
    paymentMethods: ["Fauna Bucks", "Credit Card"]
    categories: ["Clothes", "Accessories"]
    owner: {
      connect: "<owner-id>"
    }
  }) {
    _id
    name
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "createStore": {
      "_id": "316713363947127376",
      "name": "Fauna Swag Shop"
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Notice the [connect](https://docs.fauna.com/fauna/v4/api/graphql/relations#connect) keyword in the previous mutation. The *connect* keyword creates a relationship between a new entity and an existing entity, in this case, a new *Store* and an existing *Owner*. 

{{% notice note %}}
Fauna combines the simplicity of a document database with the ability to model complex relationships like relationship databases. 
{{% /notice %}}

## Finding an owner by ID

The following query finds an owner and all the stores associated with the owner. Fauna automatically generates the *findOwnerByID* query when you upload your GraphQL schema.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
query {
  findOwnerByID(id: "<owner-id>") {
    _id
    email
    name
    stores {
      data {
        _id
        name
        paymentMethods
      }
    }
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "findOwnerByID": {
      "_id": "<owner-id>",
      "email": "owner@fauna-labs.com",
      "name": "Fauna Owner",
      "stores": {
        "data": [
          {
            "_id": "<store-id>",
            "name": "Fauna Swag Shop",
            "paymentMethods": [
              "Fauna Bucks",
              "Credit Card"
            ]
          }
        ]
      }
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Finding an owner by email

Fauna provides two methods for querying documents by other attributes besides *ID*, such as a user's email address. You can allow Fauna to create the required index based on the queries you define in your schema, or you can specify an index directly.

### Allowing Fauna to create the required index

The easiest way is to query documents by an attribute is to define a query in your GraphQL schema specifying the name of the attribute you want to query on. In this case, Fauna automatically generates an index for you to find documents by that attribute.

For example, to query *Owner* by the *email* attribute, add the following query to your GraphQL schema or download the linked schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
type Query {
  findOwnerByEmail(email: String): Owner
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Find an owner by email address"
      pattern="schema-1b-2.graphql" 
      style="fauna"
/>}}

Navigate to *GraphQL* in Fauna dashboard, choose *Replace Schema*, and upload the updated schema.

Return to the *Indexes* section in the Fauna dashboard and notice that Fauna generates a new index *findOwnerByEmail*.

{{< figure
  src="./images/indexes-findOwnerByEmail.png" 
  alt="Generated index"
>}}

### Defining an index with the *@index* directive

The previous method is a shorthand for this method that uses the query name as the index name. You can also provide an *@index* directive in your schema, which allows you to give a custom name to your index.

To query *Owner* by the *email* attribute using a named index and the *@index* directive, update the definition of the *findOwnerByEmail* query in your schema with the following code or download the linked schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
type Query {
  findOwnerByEmail(email: String): [Owner] @index(name: "getByEmail")
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Owner by email with named index"
      pattern="schema-1b-3.graphql" 
      style="fauna"
/>}}

Return to the *GraphQL* section of the Fauna dashboard and replace your existing GraphQL schema with the new schema. Run the following query to find an owner by email.

{{% notice note %}}
Be sure to use the same email address that you used when creating an owner previously.
{{% /notice %}}

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
query {
  findOwnerByEmail(email: "owner@fauna-labs.com") {
    _id
    name
    email
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "findOwnerByEmail": {
      "_id": "316716761533645391",
      "name": "Fauna Owner",
      "email": "owner@fauna-labs.com"
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Get all owners

Fauna automatically generates queries based on their parameters and return values. To generate a query that returns all owners, add the highlighted line to your schema or download the linked schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql "hl_lines=4" >}}
type Query {
  findOwnerByEmail(email: String): [Owner] @index(name: "getByEmail")
  # Add the following line
  listOwners: [Owner]
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="List all owners"
      pattern="schema-1b-4.graphql" 
      style="fauna"
/>}}

Replace your existing GraphQL schema with the new schema and review the *Docs* section of your GraphQL playground. Notice that Fauna creates the *listOwners* query automatically.

Run the following query to get a list of all owners.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
query {
  listOwners {
    data {
      _id
      name
      email
    }
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "listOwners": {
      "data": [
        {
          "_id": "316716761533645391",
          "name": "Fauna Owner",
          "email": "owner@fauna-labs.com"
        }
      ]
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

As written here, this query only returns the first 64 owners it finds. This is because the generated query uses the [Paginate][fql-paginate] function, which defaults to a page size of 64. <!-- You learn how to use pagination and change page sizes later in this workshop. -->

## Review

In this section you learned how to implement common data access patterns in Fauna by defining queries in your GraphQL schema. You used implied and explicit indexes to find documents by attributes and implemented a query to retrieve all documents of a certain type.

In [the next section]({{< ref "/getting-started/custom-resolvers" >}}), you learn how resolvers work and how to create custom resolvers and user-defined functions (UDFs) in Fauna.

---
[fql-paginate]: https://docs.fauna.com/fauna/current/api/fql/functions/paginate
[indexes]: https://docs.fauna.com/fauna/current/api/fql/indexes
[one-to-many]: https://docs.fauna.com/fauna/v4/api/graphql/relations#one2many