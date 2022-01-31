// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// components/Dashboard.js

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';
import { useLazyQuery, gql } from '@apollo/client'


const FindOwnerByEmail = gql`
  query findbyEmail($email: String!) {
    findOwnerByEmail(email: $email) {
      _id
      name
      email
      stores {
        data {
          _id
          name
        }
      }
    }
  }
`;

export default function Dashboard() {
  const router = useRouter()

  const [getCurrentUser, { data, error, loading }] = useLazyQuery(FindOwnerByEmail);
  const cookies = Cookie.get('fauna-session');

  useEffect(() => {
    if(!cookies) {
      router.push('/login')
    } 
    const current_user_email = JSON.parse(cookies).email;
		console.log('Find Email', JSON.parse(cookies));
    getCurrentUser({
      variables: {
        email: current_user_email
      }
    })
  }, [cookies])

  if(loading) {
    return <div>Loading...</div>
  }

  if(data?.findOwnerByEmail?.stores?.data) {
    const stores = data?.findOwnerByEmail?.stores?.data
    const ownerInfo = data.findOwnerByEmail;
    return (
      <>
        <h4>{ownerInfo.name}</h4>
        <div><b>Email:</b> {ownerInfo.email}</div>
        <h6>Your Stores: </h6>
        <div style={{ 
          marginTop: '20px', 
          overflow: 'auto',
          minWidth: '270px', 
          maxHeight: '60vh', 
          display: 'flex',
          justifyContent: 'center' 
        }}>
          <ul className="uk-list uk-list-large uk-list-striped">
            {
              Object.keys(stores).map((_, index) => {
                const store = stores[index]
                return (
                  <li key={store._id}>
                    <div className="container">
                      <div>{store.name}</div>
                      <p uk-margin>
                        <button 
                          className="uk-button uk-button-secondary uk-button-small" 
                          onClick={() => {
                            router.push(`/store/${store._id}/edit`)
                          }}
                        >
                          Edit</button>
                        <button 
                          className="uk-button uk-button-danger uk-button-small"
                          onClick={() => {
                            alert('Delete not implemented yet')
                          }}
                        >
                          Delete
                        </button>
                      </p>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </>
    )
  }
  return <div>Dashboard</div>
}
