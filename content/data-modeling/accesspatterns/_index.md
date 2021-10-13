---
title: "Access Patterns"
date: 2021-09-15T13:35:32-04:00
draft: false
---

In this section you learn how to use various data access patterns to query your data. 

Populate your database with some data. Go to GraphQL playground and create a new owner. Use the following GraphQL *mutation*.

```graphql
mutation NewOwner {
  createOwner(data: {
    email: "owner@email.com",
    name: "John Doe"
  }) {
    _id
    name
  }
}
```

Fauna auto queries some basic queries (as seen earlier). You can query a user by their `id.` However, what if you want to query an owner by a custom field (i.e. `email,` `name`). 

#### 1. Find owner by email
Create a new index `owner_by_email`

Create a new function to query owner by index.

```clojure
Query(
    Lambda(["email"],
        Map(
            Paginate(
                Match(Index("owner_by_email"), Var("email"))
            ),
            Lambda("owner", Get(Var("owner")))
        ),
    )
)
```
