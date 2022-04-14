// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

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