---
title: "Authentication"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 30
pre: "<b>b. </b>"
---


In this section, you will learn how to do user authentication from your client application. 

You can find the completed code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.2-user-auth).

### User Signup
To get started, create a new file called `components/Signup.js` in the root of your application and add the following code. This React component is your signup form.

```jsx
import { useState, useEffect } from 'react'

const INITAL_STATE = {
  name: '',
  email: '',
  password: '',
}

export default function Signup() {

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
  }

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

Next, create a new file called `pages/signup.js`. Creating a file under pages creates a new route in Next.js. Adding the `pages/signup.js` file adds a new `/signup` route to your application. Make the following changes to your `pages/signup.js` file. 

```jsx
// pages/signup.js

import Signup from '../components/Signup'
import styles from '../styles/Home.module.css'

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <Signup />
    </div>
  )
}
```

> Notice, we are plugging in the `Signup` component to signup page. We do this because it is a good practice not to have API logic in your page level component.

Run the application with npm run dev command and visit [localhost:3000/signup](http://localhost:3000/signup). Ensure that the signup page is loading.  


{{< figure
  src="./images/9.png" 
  alt="Signup page"
>}}

In the previous section, you created a signup mutation in GraphQL. On the signup page on form submit, you call this `signup` mutation using the apollo-client library. Make the following changes to your Signup component.


{{% expand %}}
First, import the `useMutation` and `gql` funciton from apollo-client library. Define the `signup` mutation as a JavaScript query string constant.

```jsx
...
import { useMutation, gql } from '@apollo/client';

const SIGN_UP = gql`
  mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
    signup(email: $email, name: $name, password: $password) {
      _id
      name
      email
    }
  }
`;
```
{{% /expand %}}

{{% expand %}}
Next, attach the mutation with a button. So when the button is selected the mutation fires. Create a `useEffect` hook to listen on the signup response. 

```jsx
export default function Signup() {
  const [signupUserFunc, { data, loading, error }] = useMutation(SIGN_UP);
  ... 

  useEffect(() => {
    if(data) {
      alert('Signup Complete')
      setState(INITAL_STATE);
      console.log(data);
    }
  }, [data])
  ...

  const doSignup = e => {
    e.preventDefault(); 
    signupUserFunc({
      variables: {
          ...state,
      },
    })
  }

  if (loading) return 'Submitting...';
  if (error) return 'Something went wrong...'

  return (
    <div>....</div>
  )

}
```


{{% /expand %}}



With all the updates applied your `components/Signup.js` will be simmilar to the following code snippet.

```jsx
// components/Signup.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from "@apollo/client";

const SIGN_UP = gql`
  mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
    signup(email: $email, name: $name, password: $password) {
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

After you update the `Signup` component, try registering a user. Navigate to *Collections* in your Fauna dashboard and review the `Owner` collection. Your newly registered users will appear in this collection.

{{< figure
  src="./images/1.png" 
  alt="Newly registered user"
>}}

### User Login

Next, create a simple login component. Create a new file `components/Login.js`. Add the following code to your file. 

```jsx
// components/Login.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'


const LOGIN = gql`
  mutation OwnerLogin($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      ttl
      secret
    }
  }
`;

export default function Login() {
  const [loginFunc, { data, loading, error }] = useMutation(LOGIN)
    
  const [state, setState] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if(data) {
      // TODO: Save User Session
      alert('User Logged in')
      console.log(data);
    }
  }, [data])
    
  const doLogin = e => {
    e.preventDefault();
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
    <div>
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

Create a new page `pages/login.js`. Add the following code to this file. You plug your `Login` component into your login page component.

```jsx
// pages/login.js

import Login from '../components/Login'
import styles from '../styles/Home.module.css'

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  )
}
```

To ensure everything is working as intended, run the application with `npm run dev command`, and visit [localhost:3000/login](http://localhost:3000/login). Verify the login function is working. Log in with a user you have registered before. Observe the console tab in your browser.

{{< figure
  src="./images/3.png" 
  alt="User login view"
>}}

{{< figure
  src="./images/4.png" 
  alt="Login response"
>}}

If you are getting a secret back from your GraphQL request, that means everything is working as intended. You can now use this secret to interact with other resources in Fauna. In the next section, you learn how to manage your user sessions with the client.

You can find the completed code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.2-user-auth).

