---
title: "Session management"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 40
pre: "<b>c. </b>"
---


In this section, you will learn how to do user authentication from your client application. 

You can find the completed code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.2-user-auth).

### User Signup
To get started, create a new file called `components/Signup.js` in the root of your application and add the following code. This React component is your signup form.

```jsx
import { useState } from 'react'
import { useQuery, gql } from "@apollo/client";

export default function Signup() {
    const { data, loading, error } = useQuery(QUERY);
    
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
    });

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
        <div uk-grid="true">
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