---
title: "Data modeling"
date: 2021-09-15T13:35:32-04:00
draft: false
weight: 30
disableMermaid: false
---

The following diagram shows the relationships between data in a typical multi-vendor e-commerce application (similar to Shopify or Amazon).

{{< mermaid >}}
erDiagram
    STORE }|..|{ CUSTOMER : has
    STORE {
        string name
        string customerRef
    }
    CUSTOMER {
        string name
        string email
        string deliveryAddress
        string storeReference
    }
    CUSTOMER ||--O{ ORDER : has
    ORDER {
        string orderNumber
        string customerRef
        number cost
        string itemsReference
    }
    STORE ||--o{ ITEM : has
    ITEM {  
        string name
        number cost
        number inventory
    }
    ORDER ||--o{ ITEM : has
    STORE_OWNER ||--o{ STORE : has
{{< /mermaid >}}

{{< mermaid >}}
erDiagram
    OWNER ||--O{ STORE : has
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

In the database, you have 

1. A collection of Store Owners. 
1. Each owner can own multiple stores. 
1. Stores have many orders and customers. 
1. Stores also have many items. 
1. Customers can have many orders and 
1. Each order has at least one or more items

Define this relationships with the following GraphQL schema.

```graphql
type Owner {
    name: String!
    email: String!
    stores: [Store!]! @relation
}

type Store {
    name: String!
    owner: Owner!
    items: [Item] @relation
    orders: [Order] @relation
    customers: [Customer] 
}

type Item {
    name: String!
    price: Float!
    sku: String!
    store: Store!
    order: Order!
}

type Customer {
    name: String!
    email: String!
    deliveryAddress: String!
    orders: [Order] @relation
    stores: [Store] @relation
}

type Order {
    items: [Item!]! @relation
    store: Store!
    total: Float!
    owner: Customer!
}
```

Go to *GraphQL* menu in the dashboard and upload the schema.