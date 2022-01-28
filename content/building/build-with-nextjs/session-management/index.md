---
title: "Session management"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 23
pre: "<b>c. </b>"
---


In this section, you learn about session management in your client application. There are several ways to manage sessions in single-page web applications. The most common one is to manage sessions through browser cookies. In this section, you learn how to manage sessions with browser cookies.

Install the `js-cookie` dependency in your project by running the following command in your terminal.

{{< tabs groupId="shell" >}}
{{% tab name="Shell" %}}
```console
npm i js-cookie
```
{{% /tab %}}
{{< /tabs >}}

Open the `components/Login.js` file and add the following code changes. You use the js-cookie library to store the login response in the browser cookies section. You can retrieve this cookie and the secret inside it whenever needed and query Fauna.


{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx {hl_lines=["5-6",12,"20-27",32]}
// components/Login.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import Cookie from 'js-cookie';
import { useRouter } from 'next/router'

...

export default function Login() {
  const [loginFunc, { data, loading, error }] = useMutation(LOGIN)
  const router = useRouter()
    
  const [state, setState] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if(data) {
    Cookie.set(
      'fauna-session', 
      JSON.stringify(data.login),
      { expires: data.ttl }
    )
    router.push('/')
  }
    }, [data, router])
    
    const doLogin = e => {
        e.preventDefault();
        Cookie.remove('fauna-session')
        loginFunc({
            variables: {
                ...state
            }
        }).catch(e => console.log(e))   
    }

...
}
```
{{% /tab %}}
{{< /tabs >}}

After you make the changes your `components/Login.js` file should be simmilar to the following code snippet. 

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
// components/Login.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';


const LOGIN = gql`
  mutation OwnerLogin($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
        ttl
        secret
        email
    }
  }
`;

export default function Login() {
  const [loginFunc, { data, loading, error }] = useMutation(LOGIN)
  const router = useRouter()
    
  const [state, setState] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if(data) {
      Cookie.set(
        'fauna-session', 
        JSON.stringify(data.login),
        { expires: data.ttl } // 30 mins from now
      )
      router.push('/')
    }
  }, [data, router])
    
  const doLogin = e => {
    e.preventDefault();
    Cookie.remove('fauna-session')
    loginFunc({
      variables: {
          ...state
      }
    }).catch(e => console.log(e))   
  }

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return 'Submitting...';

    return (
      <div uk-grid="true">
        <div>
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Login</h3>
            {error ? 
              <div className="uk-alert-danger" uk-alert style={{ maxWidth: '300px', padding: '10px'}}>
                Incorrect email and password
              </div> : null 
            }
            <form onSubmit={doLogin}>
              <div className="uk-margin">
                <input 
                  className="uk-input" 
                  type="text" 
                  placeholder="Email" 
                  name="email"
                  onChange={handleChange}
                  value={state.email}
                />
              </div>
              <div className="uk-margin">
                <input 
                  className="uk-input" 
                  type="password" 
                  placeholder="Password" 
                  name="password"
                  onChange={handleChange}
                  value={state.password}
                />
              </div>
              <div className="uk-margin">
                <input className="uk-input" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}
```
{{% /tab %}}
{{< /tabs >}}

Create a new component `components/Dashboard`. Authenticated users are presented with a dashboard view. If a user is not authenticated that user is redirected to the login view. Add the following code to your Dashboard component.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
// components/Dashboard.js

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'

export default function Dashboard() {
  const router = useRouter()
  const cookies = Cookie.get('fauna-session');

  useEffect(() => {
    if(!cookies) {
      router.push('/login')
    } 
  }, [cookies, router])

  return <div>Dashboard</div>
}
```
{{% /tab %}}
{{< /tabs >}}

Replace the contents of your index page with the following code. 

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
// pages/index.js
import Dashboard from '../components/Dashboard'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Dashboard />
    </div>
  )
}
```
{{% /tab %}}
{{< /tabs >}}

When a new user signs up you want to clear the session cookies as well. Add the following code changes to your `SignUp` component.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx {hl_lines=[5,12]}
// components/Signup.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import Cookie from 'js-cookie'


export default function Signup() {
  ...
  const doSignup = e => {
    e.preventDefault(); 
    Cookie.remove('fauna-session')
    signupUserFunc({
      variables: {
        ...state,
      },
    })
  }
  ...
  return (
      ...
  )
}
```
{{% /tab %}}
{{< /tabs >}}

Once you make the changes your final `components/Signup.js` file will look like following.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import Cookie from 'js-cookie'

const SIGN_UP = gql`
  mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
    registerOwner(email: $email, name: $name, password: $password) {
      _id
      name
      email
    }
  }
`;

const INITAL_STATE = {
  name: '',
  email: '',
  password: '',
}

export default function Signup() {
  const [signupUserFunc, { data, loading, error }] = useMutation(SIGN_UP);

  const [state, setState] = useState(INITAL_STATE);

  useEffect(() => {
    if(data) {
      alert('Signup Complete')
      setState(INITAL_STATE);
      console.log(data);
    }
  }, [data])

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const doSignup = e => {
    e.preventDefault(); 
    Cookie.remove('fauna-session')
    signupUserFunc({
      variables: {
          ...state,
      },
    })
  }

  if (loading) return 'Submitting...';
  if (error) return 'Something went wrong...'

  return (
    <div uk-grid>
      <div>
        <div className="uk-card uk-card-default uk-card-body">
          <h3 className="uk-card-title">Sign up</h3>
          <form onSubmit={doSignup}>
            <div className="uk-margin">
              <input 
                className="uk-input" 
                type="text"
                placeholder="Username" 
                name="name" 
                onChange={handleChange} 
                value={state.name}
                autoComplete="off"
              />
            </div>
            <div className="uk-margin">
              <input 
                className="uk-input" 
                type="text" 
                placeholder="Email" 
                name="email"
                onChange={handleChange}
                value={state.email}
              />
            </div>
            <div className="uk-margin">
              <input 
                className="uk-input" 
                type="password" 
                placeholder="Password" 
                name="password"
                onChange={handleChange}
                value={state.password}
              />
            </div>
              <div className="uk-margin">
                <input className="uk-input" type="submit" />
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}
```
{{% /tab %}}
{{< /tabs >}}

You can take advantage of the apollo-client library’s `setContext` function to dynamically update the authorization token for every GraphQL request when cookies update. Make the following changes in your `apollo-client.js` file. 

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
// apollo-client.js

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookie from 'js-cookie';

const httpLink = createHttpLink({
    uri: 'https://graphql.fauna.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const cookies = Cookie.get('fauna-session');
  const token = cookies ? JSON.parse(cookies).secret : process.env.NEXT_PUBLIC_FAUNA_SECRET
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
```
{{% /tab %}}
{{< /tabs >}}

Run your application with `npm run dev` command and sign in with a user you have registered. Observe your browser cookies. Notice that a cookie value named fauna-session is saved. 

{{< figure
  src="./images/1.png" 
  alt="session from cookies"
>}}

In the next section, you learn how to retrieve the user access token from your cookies and make GraphQL queries and mutations using it. 