---
title: "User Authentication"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 3
pre: "<b>c. </b>"
---

In the previous section, you learned how to access data using different access patterns in Fauna. You also learned how to create custom resolvers and UDFs to perform computation on your data. In this section, you learn how to do user authentication using the fundamentals of data access and UDFs that you learned previously. 

Notice that the previous GraphQL schema represents a data model of a simple multi-vendor e-commerce application. You have a `one_to_many` relationship between `Owner` and `Store` types. An owner can have multiple stores, and a store belongs to exactly one owner. 

In your application, store owners can register, log in, and manage their stores. User-defined functions (UDFs) are the key to implementing this functionality. 

### User Registration


Navigate to *Function* > *New Function* to create a new UDF.  Name your UDF `UserRegistration`. In the function body, add the following code. Select *Save* to create the UDF.

```Clojure
Query(
  Lambda(
    ["email", "password", "name"],
    Create(Collection("Owner"), {
      credentials: { password: Var("password") },
      data: { 
        email: Var("email"), 
        name: Var("name"),
        stores: []
      }
    })
  )
)
```

{{% notice note %}}
*💡 The UDF is writen in a functional language called FQL (Fauna Query Language). Function compositions in FQL are similar to JavaScript.  Like JavaScript functions are first class citizens in FQL, meaning you can pass functions as arguments and compose functions together. You learn more about FQL in the later section where you get to disect this function.*
{{% /notice %}}

Running this UDF registers a new owner (creates a new record in the Owner collection). Fauna shell gives you the ability to test your UDFs. Let's go ahead and try this UDF.

Navigate to *Shell* from Fauna dashboard. In the shell, add the following code to call the UDF. Notice the `Call` function in the following code snippet. The first argument in the `Call` function is the name of the UDF you are trying to execute. You add the arguments for your UDF in sequential order. In this case, you specify the user email, password, and username in that order. Execute the UDF by selecting *Run Query*.

```Clojure
Call("UserRegistration", "johndoe@email.com", "pass123456", "Jon Doe" )
```

{{< figure
  src="./images/1.png" 
  alt="Run UDF in Fauna shell"
>}}

Navigate to *Collection > Owner.* Observe that a new document appears in your Owner collection. Notice that Fauna doesn't show the password. In the `UserRegistration` UDF, the password field is a `credential` variable. That's why Fauna saves the password without revealing it to anyone.

{{< figure
  src="./images/2.png" 
  alt="New document in Owner collection"
>}}

Lets attach this UDF to a GraphQL mutation. Create a new mutation called `signup` in your GraphQL schema. Use the `@resolver` directive to connect the `UserRegistration` UDF as a resolver for this mutation.

> Follow this link to learn more about [graphql directives in Fauna](https://docs.fauna.com/fauna/v4/api/graphql/directives/)

```gql
type Owner {
  name: String!
  email: String!
  stores: [Store]! @relation
}

type Store {
  name: String!
  email: String!
  paymentMethods: [String]
  categories: [String]
  owner: Owner!
}

type Query {
  findOwnerByEmail(email: String): [Owner] @relation(name: "OwnerByEmail")
}

type Mutation {
  signup(email: String!, password: String!, name: String!): Owner @resolver(name: "UserRegistration")
}
```

Navigate back to GraphQL playground and upload the updated schema. Run the following mutation to register a new user.

```gql
mutation {
  signup(email: "shadid@fauna.com", name: "Shadid", password: "Pass12345") {
    _id
    name
    email
  }
}
```

```json
// response
{
  "data": {
    "signup": {
      "_id": "312490154633724485",
      "name": "Shadid",
      "email": "shadid@fauna.com"
    }
  }
}
```

### User Login

Navigate to *Function > New Function* again to create a new UDF. Name your UDF `UserLogin`. In the function body, add the following code. Select Save to create the UDF.

```Clojure
Query(
  Lambda(
    ["email", "password"],
    Let(
      {
        credentials: Login(Match(Index("findOwnerByEmail"), Var("email")), {
          password: Var("password"),
          ttl: TimeAdd(Now(), 1800, "seconds")
        })
      },
      {
        secret: Select("secret", Var("credentials")),
        ttl: Select("ttl", Var("credentials")),
        email: Var("email")
      }
    )
  )
)
```

Once the UDF is created you can run it in the Fauna shell. Navigate to Dashboard > Shell and run the UDF with the following command.

```Clojure
Call("UserLogin", "johndoe@email.com", "pass123456")
```

```jsx
// response 
{
  secret: "fnEEVx2xB2ACRARTR_-UQAZEgHZB-rfk_CHWpf3Z02Mn08ZS_Qc",
  ttl: Time("2021-10-18T02:19:35.312990Z"),
  email: "johndoe@email.com"
}
```

Running this UDF authenticates your user (owner). The UDF returns a user access token. In the next section, you will learn how to use this access token to interact with specific resources in Fauna.

Create a new mutation called `login` in your GraphQL schema and attach the `UserLogin` UDF as the resolver. The UDF returns an object. You create an embedded object and assign it as a return type for your `login` mutation. Refer to the following code and make the changes to your schema.

```graphql
type Owner {
  name: String!
  email: String!
  stores: [Store]! @relation
}

type Store {
  name: String!
  email: String!
  paymentMethods: [String]
  categories: [String]
  owner: Owner!
}

# Embeded type for returned token response
type Token @embedded {
  ttl: Time!
  secret: String!
  email: String!
}

type Query {
  findOwnerByEmail(email: String): [Owner] @relationresolver(name: "OwnerByEmail")
  listOwners: [Owner] @relationresolver(name: "ListAllOwners")
}

type Mutation {
  signup(email: String!, password: String!, name: String!): Owner @resolver(name: "UserRegistration")
  login(email: String!, password: String!): Token @resolver(name: "UserLogin")
}
```

Upload your updated GraphQL schema. Run the following mutation in the GraphQL playground to verify that the login functionality is working.

```graphql
mutation {
  login(email: "shadid@fauna.com", password: "Pass12345") {
    ttl
    secret
  }
} 
```

```JSON
// success response
{
  "data": {
    "login": {
      "ttl": "2021-10-08T06:05:36.229546Z",
      "secret": "<identity_token>"
    }
}
```

That’s it you have implemented a simple authentication with Fauna. When an owner of a store logs in to your client application, that person gets this temporary access token. This temporary token has limited privileges and can only query specific resources. 

This concept of providing the least privilege to ensure security is part of Attribute-Based Access Control (ABAC). You learn more about ABAC and the security protections built into Fauna later in this workshop.