---
title: "Multi-tenant apps with Fauna"
date: 2022-03-20T15:44:53
draft: false
weight: 63
pre: "<b>c. </b>"
---

This section demonstrates how a multi-tenant web application works. The aim of this workshop is not to build a fully functional multi-tenant app. This workshop rather aims to provide you the knowledge of how multi-tenancy works at the application and database level.

## Demo Multi-tenant App

In the example marketplace app, you can set up each shop as a separate frontend app with its dedicated child database. In this workshop, however, we will not deploy individual frontend apps for each shop. We would instead treat a particular shop page as a separate application.

In your parent database, head over to the _Security > Roles > FrontEndRole_ and provide read access to `Store` collection and `allShops` index.

{{< figure
  src="./images/front_end_role_access.png" 
  alt="Update Access to FrontEndRole"
>}}

### Application framework options

Next, build your frontend with either one of the following frameworks.

* [Next.js]({{< relref "build-with-nextjs" >}})

* [SvelteKit]({{< relref "build-with-sveltekit" >}})


