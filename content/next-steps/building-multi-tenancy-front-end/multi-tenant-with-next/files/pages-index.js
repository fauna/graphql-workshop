// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

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
