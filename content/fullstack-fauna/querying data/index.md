---
title: "Querying data"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 40
pre: "<b>d. </b>"
---

In this section, you learn how to query data from your client application and implement attribute-based access control (ABAC).

> “Attribute-based access control, also known as policy-based access control for IAM, defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together.” – wikipedia

In the previous section, you were able to log in a user and save their session in browser cookies. To query retrieve data using the access token (saved in session cookies) you first need to define a role in Fauna. This role will specify the resources you can interact with. 

Navigate to Fauna [dashboard](https://dashboard.fauna.com/accounts/login). Select *Security > Roles > New Role*. 

{{< figure
  src="./images/1.png" 
  alt="navigate to security"
>}}

Name your new role `AuthRole` since all authenticated users will assume this role. In the collection section, provide `read` privilege to both `Owner` and `Store` collections. 

{{< figure
  src="./images/2.png" 
  alt="specify privileges"
>}}

Navigate to the membership tab and add `Owner` collection as the member collection. This is what tells Fauna that the Owner collection is where you are storing user information and logging in. 

{{< figure
  src="./images/3.png" 
  alt="adding membership"
>}}

Navigate back to the *Privileges* tab. In the *Indexes* section add `findOwnerByEmail` and `owner_stores_by_owner` index. Give read privilege to both of these indexes. The `findOwnerByEmail` will let you query a user by email using the generated access token. The `owner_stores_by_owner` will let you query the stores that belong to a particular user.

{{< figure
  src="./images/4.png" 
  alt="adding indexes"
>}}

When an owner logs in to your application you want to show that user their basic information (i.e. username, email) and all the stores that belong to that owner. To do so you can make the following GraphQL query with the owner’s email as a parameter.

```graphql
query findbyEmail($email: String!) {
  findOwnerByEmail(email: $email) {
    data {
      email
      name
      stores {
        data {
          _id
          name
        }
      }
    }
  }
}
```

Make the following changes to your `components/Dashboard.js` file to run this query when your dashboard component loads.

```jsx
// components/Dashboard.js

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';
import { useLazyQuery, gql } from '@apollo/client'


const FindOwnerByEmail = gql`
  query findbyEmail($email: String!) {
    findOwnerByEmail(email: $email) {
      data {
        email
        name
        stores {
          data {
            _id
            name
          }
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
    getCurrentUser({
      variables: {
        email: current_user_email
      }
    })
  }, [cookies])

  if(loading) {
    return <div>Loading...</div>
  }

  if(data?.findOwnerByEmail?.data[0]) {
    const ownerInfo = data.findOwnerByEmail?.data[0];
    const stores = data.findOwnerByEmail?.data[0].stores.data;
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
            {stores.map(store => (
              <li key={store._id}>
                <div className="container">
                  <div>{store.name}</div>
                  <p uk-margin>
                    <button className="uk-button uk-button-secondary uk-button-small">Edit</button>
                    <button className="uk-button uk-button-danger uk-button-small">Delete</button>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
  return <div>Dashboard</div>
}
```

Run your application with `npm run dev` command and make sure everything is working as intended.


### UI refactor 

Let’s refactor the UI to make things tidy. Add a navigation bar and logout button. When a user logs out you delete the session cookies. Create a new component components/Navbar.js and the following code in there.

```jsx
// components/Navbar.js

import { useRouter } from 'next/router'
import Link from 'next/link'
import Cookie from 'js-cookie'

export default function Navbar() {
  const router = useRouter()
  const logOut = () => {
      Cookie.remove('fauna-session')
      router.push('/login')
  }

  return (
    <nav className="uk-navbar-container" style={{ display: 'flex'}}>
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li className="uk-active"><Link href='/'>Fauna E-Com</Link></li>
        </ul>
      </div>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav">
          <li >
            <Link href='/store/new' className="uk-button uk-button-primary" style={{ color: 'white'}}>
              Add Store
            </Link>
          </li>
          <li >
            <a onClick={logOut} className="uk-button uk-button-danger" style={{ color: 'white'}}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
```
Next, create a Layout component. Create a new file `components/layout.js` and add the following code.

```jsx
// components/layout.js
import Navbar from './Navbar'
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
```

Wrap your `pages/index.js` page component with the new layout you created. Make the following changes.

```jsx
import Dashboard from '../componets/Dashboard'
import Layout from '../componets/Layout'
import styles from '../styles/Home.module.css'

export default function Home() {

  return (
    <Layout>
      <div className={styles.container}>
        <Dashboard />
      </div>
    </Layout>
  )
}
```

Navigate to your browser and notice that the new layout is now applied.

{{< figure
  src="./images/5.png" 
  alt="adding indexes"
>}}

That’s all for this section. In the next section, you will implement Create Delete and Update stores. You will also do a deep dive into custom resolvers and Fauna Query Language (FQL).

Find the complete code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.4-query-data).