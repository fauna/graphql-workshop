---
title: "Fauna concepts"
date: 2021-09-15T13:35:32-04:00
draft: false
weight: 10
---

**Goal**: Get the "aha" moment as quickly as possible

<!-- TODO: Fix link -->
1. Download [this schema](/schemas/initial-schema.graphql)
1. Open the [Fauna dashboard](https://dashboard.fauna.com)
1. Create a database
    * Use the *Classic* Region Group. You learn more about RGs later
{{< figure
  src="/images/classic-region-group-screenshot.png" 
  alt="Screen capture highlighting the Classic Region Group in the Fauna dashboard."
>}}
1. Go to the *GraphQL* tab
1. Upload this schema

Fauna does a bunch of magic. Isn't that awesome? You can see for yourself.


{{< highlight graphql >}}
mutation firstCustomer{
  createCustomer(
    data:{
      name:"Fauna",
      users: {
        create:[
          {
            name:"First Customer",
            email:"first.customer@fauna.com"
          }
        ]
      },
      paymentMethod:{
        name:"Company credit card"
      }
    }
  ){
    _id
    name
    users{
      data{
        name
      }
    }
  }
}{{< /highlight >}}

### Results

{{< highlight json >}}
{
  "data": {
    "createCustomer": {
      "_id": "309831940708500035",
      "name": "Fauna",
      "users": {
        "data": [
          {
            "name": "First Customer"
          }
        ]
      }
    }
  }
}
{{< /highlight >}}

### Query

{{< highlight graphql >}}
query listUsersByCustomerID{
  findCustomerByID(id:"309831940708500035"){
    name
    users{
      data{
        name
      }
    }
  }
}
{{< /highlight >}}


Navigate to the *Collections* tab. Each `type` you specified has its own collection.

We'll use these resources you create to explain concepts in this workshop.
