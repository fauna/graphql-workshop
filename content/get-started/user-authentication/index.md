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