---
title: "Custom resolvers"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 70
pre: "<b>f. </b>"
---


In this section, you learn about GraphQL resolvers in-depth and how they work in Fauna.

> ***A resolver is a function that's responsible for populating the data for a single field in your schema. Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source.*** - apollographql.com

GraphQL resolvers are part of your application layer and can be written in any language. In Fauna you use FQL (*Fauna Query Language*) to write resolver functions. However, keep in mind that Fauna is not an application server. Fauna is a Database that supports GraphQL as a native API. It uses FQL to do database operations (similar to SQL in traditional MySQL or Postgresql). FQL is designed for complex, precise manipulation and retrieval of data. 

With FQL, you have the flexibility to perform complex business logic in your Database layer (inside Fauna). However, don't confuse Fauna with a complete application server; instead, think of Fauna as a robust, flexible database capable of doing a lot more than traditional databases. 

### Creating your first custom resolver

Let's review how you can create your first custom resolver. To make a custom resolver, you do the following.
    
1. **Define a query/mutation in your schema**
2. **Write a UDF in Fauna**
3. **Map the query/mutation to your UDF**

You have already done this with your `login` and `signup` mutation in the [authentication](/fullstack-fauna/authentication/) section. Let's revisit the `login` mutation to understands what's going on.

You first defined the `login` function in your schema, as shown in the following code snippet.

{{< tabs groupId="query-language" >}}
{{% tab name="GraphQL" %}}
```gql
...

type Mutation {
  ...
  login(email: String!, password: String!): Token @resolver(name: "UserLogin")
}
```
{{% /tab %}}
{{< /tabs >}}

Next, you defined a function inside Fauna called `UserLogin`. Notice the `@resolver` keyword. Since you defined the resolver directive, Fauna knows that you are trying to resolve this mutation with a custom resolver function called `UserLogin`

You can learn more about the [@resolver directive here](https://docs.fauna.com/fauna/current/api/graphql/directives/d_resolver).

Head over to the Fauna > Dashboard > Functions > UserLogin to view the function. Let's disect this function.

{{< tabs groupId="query-language" >}}
{{% tab name="FQL" %}}
```js
// UserLogin

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
        email: Var("email"),
        ownerID: Select(
          ["id"],
          Select(
            0,
            Paginate(Match(Index("findOwnerByEmail"), "test@email.com"))
          )
        )
      }
    )
  )
)
```
{{% /tab %}}
{{< /tabs >}}

First on all, review the `Login` keyword in the previous code snippet. `Login` function is a prebuilt function provided by Fauna. The Login function creates an authentication token for the provided identity. You can call this function from Fauna shell. Head over to Fauna shell and run this function with the following command. Make sure to replace <user-referece> with a user's reference `id` that is in your database and password with a valid password.

{{< tabs groupId="query-language" >}}
{{% tab name="FQL" %}}
```js
Login(
  Ref(Collection('characters'), '<user-referece>'),
  { password: 'abracadabra' },
)
```
{{% /tab %}}
{{< /tabs >}}

This will generate a authentication token. Notice that the password field is a temprary field and the password is not saved in the database. You can learn more about the built-in functions in the [FQL cheatsheets](https://docs.fauna.com/fauna/current/api/fql/cheat_sheet).

Let's review the `UserLogin` function again. Every user-defined functions (UDFs) start with a `Query` keyword and a `Lambda` keyword. These two keywords act as a function declaration in FQL.

The Lambda function is an anonymous function that performs lazy execution of custom code. It allows you to organize and execute almost any of the Fauna Query Language statements. You can pass in custom arguments to `Lambda` that you can later use in the Query. In your UserLogin function you have `email` and `password` defined as arguments. You also have a `Let` function. The `Let` function binds one or more variables to a single value or expression. You use the `Select` function to extract single values from the returned object. 

Review the [FQL cheatsheets](https://docs.fauna.com/fauna/current/api/fql/cheat_sheet) to learn more.

