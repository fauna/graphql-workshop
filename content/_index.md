---
title: "Introduction to Fauna"
date: 2021-09-15T13:35:32-04:00
draft: false
---
# Fauna for GraphQL developers

<!-- {{< vimeo id="652199129" >}} -->

Welcome to Fauna! This workshop helps [GraphQL][graphql] developers build applications with [Fauna][fauna] that scale to any size userbase. You start with the basics, using only the GraphQL playground in the [Fauna dashboard][fauna-dashboard], then build a complete fullstack application with [Next.js][nextjs], adding functionality as you go along.

In the first section, [Getting started with Fauna]({{< ref "getting-started" >}}), you learn how Fauna automatically creates queries, mutations, and other resources based on your GraphQL schema. You learn how to navigate the Fauna dashboard and accomplish common tasks such as user authentication with GraphQL.

In the second section, [Building with Fauna]({{< ref "building" >}}), you create a single-tenant application in Next.js that allows users to register for accounts and create their own sites. You setup your application, connect to Fauna, implement user authentication, and create your first custom resolver in the [Fauna Query Language (FQL)](fql).

## Pre-requisites

You must have a Fauna account to complete this workshop. If you don't have one already, you can [sign up for an account][fauna-signup] and complete this workshop using Fauna's free tier. You do not need to provide payment information until you upgrade your plan. 

{{% notice note %}}
This workshop assumes that you are already familiar with GraphQL and are exploring Fauna for its native GraphQL support. If you are not familiar with GraphQL, visit [Introduction to GraphQL](https://graphql.org/learn/) on the GraphQL website.
{{% /notice %}}

Once you have access to your Fauna account, continue to the first section, [Getting started with Fauna]({{< ref "getting-started">}}).

---

[fauna]: https://fauna.com
[fauna-dashboard]: https://dashboard.fauna.com
[fauna-signup]: https://dashboard.fauna.com/accounts/register
[fql]: https://docs.fauna.com/fauna/current/api/fql/
[graphql]: https://graphql.org
[graphql-learn]: https://graphql.org/learn/
[nextjs]: https://nextjs.org
