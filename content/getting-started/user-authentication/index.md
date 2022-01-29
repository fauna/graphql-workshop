---
title: "User authentication"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 50
pre: "<b>d. </b>"
---

In the previous section, you learned how GraphQL resolvers work and created a custom resolver using a UDF in Fauna. In this section, you apply your knowledge of UDFs to authenticate users and manage access to documents.

In your application an owner can have multiple stores but a store belongs to exactly one owner. Store owners need to register, log in, and manage their stores. User-defined functions (UDFs) are the key to implementing this functionality. 

## Registering new users

Navigate to the *Functions* section of the Fauna dashboard and choose *New Function* to create a new UDF.  Name your UDF `RegisterUser` and leave the *Role* set to *None*. Add the following code to the function body and choose *Save* to create the UDF.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Query(
  Lambda(
    ["email", "password", "name"],
    Create(Collection("Owner"), {
      credentials: { password: Var("password") },
      data: { 
        email: Var("email"), 
        name: Var("name")
      }
    })
  )
)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="registerUser user-defined function (UDF)"
      pattern="RegisterUser.fql"
      style="fauna"
/>}}

The user's password is saved using the *credentials* object and not as part of the document. This directs Fauna to store a one-way cryptographic hash of the password that is subsequently used to authenticate the user. For more information, see [credentials][credentials] in the FQL documentation.

### Testing your registration UDF

Invoking this UDF registers a new owner by creating a new document in the *Owner* collection. Test this using the *Shell* section of the Fauna dashboard.

{{< figure
  src="./images/fauna-shell-calling-a-udf.png" 
  alt="Calling a UDF in the Fauna shell"
>}}

1. Navigate to the *Shell* section of the Fauna dashboard. 
1. Add the following code to call your UDF.
1. Invoke the UDF by choosing *Run Query*.

{{< tabs groupId="fauna-shell" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Call(
  "RegisterUser",
  // ["email", "password", "name"]
  ["john@fauna-labs.com", "pass123456", "John Faun"]
)
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight js >}}
{
  ref: Ref(Collection("Owner"), "316804786615747153"),
  ts: 1638387438370000,
  data: {
    email: "john@fauna-labs.com",
    name: "John Faun"
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The [*Call*][fql-call] function takes at least two parameters. The first is the name of the UDF to invoke. The remaining parameters are passed as arguments to your UDF in sequential order. In this case, you specify the owner's *email*, *password*, and *name* in that order.

Navigate to the *Collections* section of the dashboard, choose the *Owner* collection, and confirm that the new document appears. Notice that the dashboard does not display the hashed password as described above.

{{< figure
  src="./images/dashboard-hiding-credentials.png"
  alt="New document in Owner collection"
>}}

### Registering a user with GraphQL

The next step is to connect your UDF to a GraphQL mutation using the *@resolver* [directive][graphql-directives]. Add the following *registerOwner* mutation to your GraphQL schema or download the linked schema.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
type Mutation {
    registerOwner(email: String!, password: String!, name: String!): Owner @resolver(name: "RegisterUser")
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Add the 'registerOwner' mutation"
      pattern="schema-1d-1.graphql"
      style="fauna"
/>}}

Return to the *GraphQL* section of the Fauna dashboard and replace your schema with the updated schema. Run the following mutation to register another new user.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
mutation {
  registerOwner(email: "shadid@fauna-labs.com", name: "Shadid", password: "Pass12345") {
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
    "registerOwner": {
      "_id": "316807077133550161",
      "name": "Shadid",
      "email": "shadid@fauna-labs.com"
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## User Login

Return to the *Functions* section and create a new UDF. Name your UDF `LoginUser`, add the following code to the function body, and choose *Save* to create the UDF.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
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
        ownerId: Select(["instance", "id"], Var("credentials"))
      }
    )
  )
)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="LoginUser user-defined function (UDF)"
      pattern="LoginUser.fql"
      style="fauna"
/>}}

### Testing your login UDF

Return to the *Shell* in the dashboard and invoke your UDF using the following command.

{{< tabs groupId="fauna-shell" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Call(
  "LoginUser", 
  ["john@fauna-labs.com", "pass123456"]
)
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight js >}}
{
  secret: "fnEEZYddyZACUQRlM-EbEAZPwdLxvCg7FE9_WBSQfz6QM-zDCjw",
  ttl: Time("2021-12-01T21:01:19.838210Z"),
  email: "john@fauna-labs.com"
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Running this UDF authenticates a user and returns an access token if successful. You learn how to use this access token to interact with specific resources in Fauna from your application in the section [Building with Fauna]({{< ref "/building" >}}).

### Logging in with GraphQL

Add the following *login* mutation and *Token* type to your GraphQL schema or download the linked schema. The *Token* type uses the [*@embedded* directive][embedded-directive] to indicate that it does not need a separate collection.

{{< tabs groupId="schema" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql "hl_lines=3 6-11">}}
type Mutation {
    registerOwner(email: String!, password: String!, name: String!): Owner @resolver(name: "RegisterUser")
    login(email: String!, password: String!): Token @resolver(name: "LoginUser")
}

# Embeded type for returned token response
type Token @embedded {
    ttl: Time!
    secret: String!
    email: String!
    ownerId: String!
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="Add the 'login' mutation"
      pattern="schema-1d-2.graphql"
      style="fauna"
/>}}

Replace your GraphQL schema with the updated schema and run the following mutation to verify that login functionality is working with GraphQL.

{{< tabs groupId="query-language" >}}
{{< tab name="GraphQL" >}}
{{< highlight graphql >}}
mutation {
  login(email: "shadid@fauna-labs.com", password: "Pass12345") {
    ttl
    secret
  }
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Result" >}}
{{< highlight json >}}
{
  "data": {
    "login": {
      "ttl": "2021-12-01T21:11:21.824584Z",
      "secret": "fnEEZYfwwpACUARlM-EbEAZP1qISmu_QFiq94sSiQ0O2mE2od_0"
    }
  }
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

When an owner of a store logs in to your client application, that person receives this temporary access token. The temporary token has limited privileges and can only query specific resources. 

## Review

In this section, you learned how to use custom resolvers to authenticate users and manage access to documents.

Congratulations! You have completed the first chapter of this workshop, *Getting started with Fauna*.

In the next chapter, [*Building with Fauna*]({{< ref "/building" >}}), you apply what you have learned so far to build a fullstack serverless web app with Fauna, GraphQL, and [Next.js][next.js].

---
[credentials]: https://docs.fauna.com/fauna/current/security/credentials
[embedded-directive]: https://docs.fauna.com/fauna/v4/api/graphql/directives/d_embedded
[fql-call]: https://docs.fauna.com/fauna/current/api/fql/functions/call
[graphql-directives]: https://docs.fauna.com/fauna/v4/api/graphql/directives/
[next.js]: https://nextjs.org