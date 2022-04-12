---
title: "Multi-tenant Frontend - Next.js"
date: 2022-03-20T15:44:53
draft: false
weight: 64
pre: "<b>i. </b>"
---

You want your application index page to render all available shops. To do so make the following changes to your `pages/index.js` file.

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}

import ShopList from '../components/ShopList'
import styles from '../styles/Home.module.css'
import { useQuery, gql } from '@apollo/client'


const AllShops = gql`
  query gelAllShops {
    allShops(_size: 100) {
      data {
          _id
          name
          publicKey
        }
      }
    }
`;

export default function Home() {

  const { data, error, loading } = useQuery(AllShops);

  if (loading) { 
    return <div>loading...</div>
  }

  if (error) { 
    return <div>error...</div>
  }


  return (
    <div className={styles.container}>
      <ShopList shops={data.allShops.data}/>
    </div>
  )
}


{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="pages/index.js"
      pattern="pages-index.js" 
      style="fauna"
/>}}

Notice, in the component, you make the `allShops` query to get all the available shops. Then you plug in the retrieved data into `ShopList` component. 

The `ShopList` component renders all the shops. Create a new file, `components/ShopList.js` and add the following code.


{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}

export default function ShopList({ shops }) {
  return (
    <div className="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center" uk-grid="true">
      {
        shops.map(shop => (
          <div key={shop._id}>
            <div className="uk-card uk-card-hover uk-card-body">
              <h3 className="uk-card-title">{shop.name}</h3>
              <a className="uk-button uk-button-primary" href={`/store/${shop._id}?publicKey=${shop.publicKey}`} target="_blank" rel="noreferrer">Visit</a>
            </div>
          </div> 
        ))
      }
    </div>
  )
}

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
  title="components/ShopList.js"
  pattern="ShopList.js" 
  style="fauna"
/>}}



For each shop, a card is displayed. When a user selects `visit` button in any of these cards, a store page is opened in a new browser tab. The store page uses the secret key saved in the store document to interact with its child database.

Create a new file `pages/store/[id]/index.js` and add the following code.

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}


import { useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Products from '../../../components/Products'
import { httpLink, setCustomAuthToken } from '../../../apollo-client'


const ALL_PRODUCTS = gql`
  query ALL_PRODUCTS {
    allProducts(_size:100) {
      __typename
      data {
        _id
        name
        description
        price
        image
      }
    }
  }
`;

export default function ShopPage() {
  const router = useRouter()
  const { publicKey } = router.query

  console.log('publicKey', publicKey)

  const [execQuery, {client, loading, data, error, }] = useLazyQuery(ALL_PRODUCTS, { 
    context:  {
      headers: {
        authorization: `Bearer ${publicKey}`
      }
    }
  });

  useEffect(() => {
    if(publicKey) {
      client.setLink(setCustomAuthToken(publicKey).concat(httpLink));
      execQuery();
    }
  }, [publicKey])

  console.log('data', data?.allProducts.data)

  if(loading || !data) { 
    return <div>loading...</div>
  }

	return (
    <div className="uk-container" style={{ marginTop: '20px' }}>
      <h1 className="uk-heading-medium">Welcome!!</h1>
      <Products products={data.allProducts.data}/>
    </div>
  )
}

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
  title="pages/store/[id]/index.js"
  pattern="index.js" 
  style="fauna"
/>}}

Add the following code to your `apollo-client.js` file. The following code snippet sets specific authorization headers to Apollo client. 

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}

// ... partials of apollo-client.js
export const setCustomAuthToken = (token) => setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${token}`
  }
}));

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
  title="apollo-client.js.js"
  pattern="apollo-client.js.js" 
  style="fauna"
/>}}


The apollo client is already initialized in the client.js file. However, keep in mind that we are treating each of the `/pages/store/[id]` routes as a separate application. Because of this, you reset the apollo client's header authorization token with the child database's secret. 

You will most likely have a separate front-end in an actual application. 

Next, create a new component to view the products. Create a new file called `components/Products.js` and add the following code.


{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
export default function Products({products}) {
  const palceHolder = 'https://images.unsplash.com/photo-1636390785299-b4df455163dd';
  return (
    <div className="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center" uk-grid="true">
      {
        products.map(product => (
          <div key={product._id}>
            <div className="uk-card uk-card-hover uk-card-body">
              <h3 className="uk-card-title">{product.name}</h3>
              <img src={product.image ? product.image : palceHolder} />
              <p>{product.description}</p>
              <a className="uk-button uk-button-primary">Buy</a>
            </div>
          </div> 
        ))
      }
    </div>
  )
}

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}


{{< attachments
  title="components/Products.js"
  pattern="Products.js" 
  style="fauna"
/>}}

Each store route is a separate application with a child database. This component queries all the products from the child database's `Product` collection.