---
title: "Introduction to Fauna"
date: 2021-09-15T13:35:32-04:00
draft: false
---
# Introduction to Fauna

{{< youtube id="E13U4uuU2pQ" >}}

This workshop teaches you Fauna in two hours.

## Pre-requisites

* A Fauna account. If you don't have one sign up [here](https://dashboard.fauna.com/accounts/register)

{{% notice note %}}
We assume you come here knowing GraphQL and wanting to use Fauna for its native GraphQL support.
{{% /notice %}}

Once you have your account, [move on]({{< ref "concepts">}}) to get started.

---

(Notes to workshop creators follow; these will be incorporated and removed).

[Hugo Learn theme docs](https://learn.netlify.app/en/)

Hypothesis 1: Uploading the GraphQL schema and seeing the auto-generated queries and mutations is the "aha" moment we're looking for. Nothing should slow down getting the user to that "aha" moment.

Hypothesis 2: Speed to delivery of custom functionality (resolver) is so much greater than with Mongo, Lambda functions, etc. Hasura, et al, require you to run a Postgres server. "Ain't nobody got time for that" -- Shadid. This is the second "aha" moment.

{{% notice info %}}
If we want to do a backend/FQL-only track we can make that a separate language.
{{% /notice %}}

You learn:
* [Fundamental concepts]({{< ref "concepts" >}}) of building with Fauna
  * NO CODE HERE
* Always use [user-defined functions]({{< ref "user-defined-functions" >}})
  * DON'T PUT CODE HERE OR GO TOO DEEP TOO EARLY
  * Original: Always use user-defined functions (UDFs).
* How to [model your data]({{< ref "data-modeling" >}}) effectively
  * NO CODE HERE, ONLY PRETTY PICTURES
  * Original: Hold onto your read access patterns loosely.
  * Original: Model your data as relational documents.
* [Securing your application]({{< ref "security" >}})
  * CONCEPTS, NOT CODE
  * LOGIN FUNCTION KEY
  * Original: Compile only Login() keys into clients.
* [Something about indexes???]({{< ref "indexes" >}})
  * NO CODE HERE, ONLY PRETTY PICTURES
* Theory of Fauna
  * Original: Compute on your data, don’t load data to compute.
  * Original: Beware the single document hot write.
  * Original: Locks are an anti-pattern (and you don't need them).


## Use case

Multi-tenant SaaS app. At this point, don't worry about the tenancy aspects, only the administrative console aspects.

Customers can sign up for a new account, add authorized users, and manage payment and notification details.


### Data access patterns

1. Create a new customer.
1. Find customer by ID.
1. Find customer's payment information.
1. Find customer's notification information.
1. Get customer payment history.
1. Show all authorized users for a customer.
1. Add an authorized user to a customer.
1. Remove an authorized user from a customer.
1. Add payment information.
1. Update payment information.
1. Update notification preferences.