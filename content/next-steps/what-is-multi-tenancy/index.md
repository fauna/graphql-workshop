---
title: "What is Multi-Tenancy"
date: 2022-03-20T15:44:53
draft: false
weight: 61
pre: "<b>a. </b>"
disableMermaid: false
---

Siloed Database Multi-tenancy is an architecture pattern in which each vendor (tenant) has the flexibility to put their data in an isolated database instance. This is in contrast to a Shared Multi-tenancy model, in which tenants share the same set of tables, but are logically separated by application logic. For the purposes of this workshop, we will be implementing the siloed model. For brevity, we henceforth simply just refer to it as Database Multitenancy.

{{< mermaid >}}
flowchart TB
    tenant_A-->database_A
    tenant_B-->database_B
    tenant_C-->database_C
    teant..n-->db..n
    subgraph Tenants
    tenant_A
    tenant_B
    tenant_C
    teant..n
    end
    subgraph DBs
    database_A
    database_B
    database_C
    db..n
    end
{{< /mermaid >}}

### Advantages of Multi-tenancy

Database multi-tenancy makes it impossible for one tenant to view another tenant’s data due to a bug in the application layer or something similar. When you have a multi-tenant (multi-vendor) SaaS application, it correctly estimates which tenants are using how much of your database resources. 

Therefore, multi-tenancy can help you make valuable business decisions as well. Moreover, multi-tenancy makes data compliance easy.

### Disadvantages of Multi-tenancy

The main drawback of multi-tenancy is the initial investment. However, you can significantly cut down on this initial investment when you use a serverless managed database service like Fauna.