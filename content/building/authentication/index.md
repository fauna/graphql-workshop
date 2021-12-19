---
title: "Authentication"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 30
pre: "<b>b. </b>"
---


In this section, you will learn how to do user authentication from your client application. 

You can find the completed code for this section in this [Github link](https://github.com/fauna-labs/fauna-workshop/tree/section-1.2-user-auth).

## Installing dependencies

##### Next.js
Run the following command to add [UIKit][uikit] to your application to provide some basic styling.
##### Svelte.js
If you are using Svelt you can directly add the style sheet in your `__layout.svelte` file.

{{< tabs groupID="framework" >}}
{{< tab name="Next.js" >}}
{{< highlight console >}}
$ npm install uikit
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}
// __layout.svelte
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.9.4/dist/css/uikit.min.css" />
<script>
...
</script>
{{< /highlight >}}
{{< /tab >}}

{{< /tabs >}}

## User Signup

##### Next.js
First, create a new folder named `components` in the root of your application. In the *components* folder, create a new file named `Signup.js`  and add the following code. This creates a React component containing a signup form.

##### Svelte.js
Create a new file `src/lib/Signup.js`. Add the following code to this file to create a *Signup* component. 


{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import { useState, useEffect } from 'react'

const INITAL_STATE = {
  name: '',
  email: '',
  password: '',
}

export default function Signup() {

  const [state, setState] = useState(INITAL_STATE);

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
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}

{{< highlight jsx >}}
<script>
  let password = "";
  let email = "";
  let name = "";

  const signUpUser = mutation(SIGN_UP);

  async function onSubmit(e) {
    const formData = new FormData(e.target);
  }
</script>

<div uk-grid="true">
  <div class="main-container">
    <div class="uk-card uk-card-default uk-card-body">
      <h3 class="uk-card-title">Sign up</h3>
        <form on:submit|preventDefault={onSubmit}>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="text"
              placeholder="Username" 
              name="name" 
              autoComplete="off"
              bind:value="{name}"
            />
          </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="text" 
              placeholder="Email" 
              name="email"
              bind:value="{email}"
            />
          </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="password" 
              placeholder="Password" 
              name="password"
              bind:value="{password}"
            />
          </div>
          <div class="uk-margin">
            <input class="uk-input" type="submit" />
          </div>
        </form>
    </div>
  </div>
</div>

<style>
  .main-container {
    margin: 20% auto 0 auto;
    max-width: 500px;
  }
</style>
{{< /highlight >}}
{{< /tab >}}

{{< /tabs >}}


{{< tabs groupId="frontend" >}}

{{< tab name="Next.js" >}}
{{< attachments
      title="components/Signup.js"
      pattern="Components-Signup-v1.js" 
      style="fauna"
/>}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< attachments
      title="src/lib/Signup.svelte"
      pattern="lib-Signup.svelte" 
      style="fauna"
/>}}
{{< /tab >}}

{{< /tabs >}}

##### Next.js
Next, create a new */signup* route in your application by creating a new file called `signup.js` in the *pages* directory. Add the following code to your *pages/signup.js* file. 

##### Svelte.js
Next, create a new route */signup*. Create a new file `src/routes/signup.svelte` and add the following code.

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import Signup from '../components/Signup'
import styles from '../styles/Home.module.css'

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <Signup />
    </div>
  )
}
{{< /highlight >}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< highlight jsx >}}

<script>
  import Signup from '$lib/Signup.svelte';
</script>

<Signup />

{{< /highlight >}}
{{< /tab >}}


{{< /tabs >}}

{{< tabs groupId="frontend" >}}

{{< tab name="Next.js" >}}
{{< attachments
  title="components/Signup.js"
  pattern="pages-signup-v1.js" 
  style="fauna"
/>}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< attachments
      title="routes/signup.svelte"
      pattern="routes-signup.svelte" 
      style="fauna"
/>}}
{{< /tab >}}

{{< /tabs >}}

{{% notice note %}}
You plug in the *Signup* component to signup page. You do this because it is a good practice not to have API logic in your page level component.
{{% /notice %}}

Run the application with npm run dev command and visit [localhost:3000/signup](http://localhost:3000/signup). Ensure that the signup page is loading.  


{{< figure
  src="./images/9.png" 
  alt="Signup page"
>}}



In the previous section, you created a signup mutation in GraphQL. On the signup page on form submit, you call this `signup` mutation using the apollo-client library. Make the following changes to your Signup component.

##### Next.js
First, import the `useMutation` and `gql` functions from apollo-client library. Define the `signup` mutation as a JavaScript query string constant.
##### Svelte.js
Import `mutation` and `gql` from apollo-client library. Define the `signup` mutation as a JavaScript query string constant.


{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
...
import { useMutation, gql } from '@apollo/client';

const SIGN_UP = gql`
  mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
    registerOwner(email: $email, name: $name, password: $password) {
      _id
      name
      email
    }
  }
`;
```
{{% /tab %}}

{{% tab name="Svelte.js" %}}

```svelte
...
import { mutation } from "svelte-apollo";
import { gql } from "@apollo/client/core";
  
const SIGN_UP = gql`
  mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
    registerOwner(email: $email, name: $name, password: $password) {
      _id
      name
      email
    }
  }
`;
```

{{% /tab %}}
{{< /tabs >}}

##### Next.js
Next, attach the mutation with a button. So when the button is selected the mutation fires. Create a `useEffect` hook to listen on the signup response. 

##### Svelte.js
Next, on signup form submit make call the mutation to register a user.

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
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
{{% /tab %}}

{{% tab name="Svelte.js" %}}
```svelte
...
async function onSubmit(e) {
  const formData = new FormData(e.target);
  const data = {};
  for (let field of formData) {
    const [key, value] = field;
    data[key] = value;
  }
  console.log(data)

  try {
    await signUpUser({
      variables: {
        ...data
      }
    });
    alert('User Signed Up Successfully');
  } catch (error) {
    console.log(error);
  }
}
```

{{% /tab %}}

{{< /tabs >}}

##### Next.js
With all the updates applied your `components/Signup.js` will be simmilar to the following code snippet.

##### Svelte.js
With all the updates applied your `src/lib/Signup.svelte` will be simmilar to the following code snippet.


{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
```jsx
// components/Signup.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from "@apollo/client";

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

{{% tab name="Svelte.js" %}}
```svelte
// src/lib/Signup.svelte

<script>
  import { mutation } from "svelte-apollo";
  import { gql } from "@apollo/client/core";
  
  const SIGN_UP = gql`
    mutation OwnerSignUp($email: String!, $name: String!, $password: String! ) {
      registerOwner(email: $email, name: $name, password: $password) {
        _id
        name
        email
      }
    }
  `;

  let password = "";
  let email = "";
  let name = "";

  const signUpUser = mutation(SIGN_UP);

  async function onSubmit(e) {
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data)

    try {
      await signUpUser({
        variables: {
          ...data
        }
      });
      alert('User Signed Up Successfully');
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div uk-grid="true">
  <div class="main-container">
    <div class="uk-card uk-card-default uk-card-body">
      <h3 class="uk-card-title">Sign up</h3>
        <form on:submit|preventDefault={onSubmit}>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="text"
              placeholder="Username" 
              name="name" 
              autoComplete="off"
              bind:value="{name}"
            />
          </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="text" 
              placeholder="Email" 
              name="email"
              bind:value="{email}"
            />
          </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="password" 
              placeholder="Password" 
              name="password"
              bind:value="{password}"
            />
          </div>
          <div class="uk-margin">
            <input class="uk-input" type="submit" />
          </div>
        </form>
    </div>
  </div>
</div>

<style>
  .main-container {
    margin: 20% auto 0 auto;
    max-width: 500px;
  }
</style>

```

{{% /tab %}}
{{< /tabs >}}


{{< tabs groupId="frontend" >}}

{{< tab name="Next.js" >}}
{{< attachments
  title="components/Signup.js"
  pattern="Components-Signup-final.js" 
  style="fauna"
/>}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< attachments
  title="src/lib/Signup.svelte"
  pattern="lib-Signup-final.svelte" 
  style="fauna"
/>}}
{{< /tab >}}

{{< /tabs >}}



After you update the *Signup* component, try registering a user. Navigate to *Collections* in your Fauna dashboard and review the *Owner* collection. Your newly registered users will appear in this collection.

{{< figure
  src="./images/1.png" 
  alt="Newly registered user"
>}}

### User Login

##### Next.js
Next, create a simple login component. Create a new file `components/Login.js`. Add the following code to your file. 

##### Svelte.js
Next, create a simple login component. Create a new file `src/lib/Login.svelte`. Add the following code to your file. 

{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
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
{{% /tab %}}

{{% tab name="Svelte.js" %}}
```svelte
// src/lib/Login.svelte

<script>
  import { goto } from '$app/navigation';
  import { mutation } from "svelte-apollo";
  import { gql } from "@apollo/client/core";

  const LOGIN = gql`
    mutation OwnerLogin($email: String!, $password: String! ) {
      login(email: $email, password: $password) {
        ttl
        secret
      }
    }
  `;

  let password = "";
  let email = "";
  let errorMsg = "";

  const login = mutation(LOGIN);

  async function onSubmit(e) {
    const formData = new FormData(e.target);
    errorMsg = "";
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data)

    try {
      await login({
        variables: {
          ...data
        }
      });
      alert('User Logged in Successfully');
      goto(`/`, { replaceState: true })
    } catch (error) {
      errorMsg = error;
      console.log(error);
    }
  }


</script>

<div class="main-container">
  <div>
    <div class="uk-card uk-card-default uk-card-body">
      <h3 class="uk-card-title">Login</h3>
      
      {#if errorMsg !== ''}
        <div class="uk-alert-danger" uk-alert>
          <p>{errorMsg}</p>
        </div>  
      {/if}

      <form on:submit|preventDefault={onSubmit}>
        <div class="uk-margin">
          <input 
            class="uk-input" 
            type="text" 
            placeholder="Email" 
            name="email"
            bind:value="{email}"
          />
        </div>
          <div class="uk-margin">
            <input 
              class="uk-input" 
              type="password" 
              placeholder="Password" 
              name="password"
              bind:value="{password}"
            />
          </div>
          <div class="uk-margin">
            <input class="uk-input" type="submit" />
          </div>
      </form>
    </div>
  </div>
</div>

<style>
  .main-container {
    margin: 20% auto 0 auto;
    max-width: 500px;
  }
</style>
```
{{% /tab %}}
{{< /tabs >}}



{{< tabs groupId="frontend" >}}

{{< tab name="Next.js" >}}
{{< attachments
  title="components/Login.js"
  pattern="Components-Login.js" 
  style="fauna"
/>}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< attachments
  title="src/lib/Login.svelte"
  pattern="lib-Login.svelte" 
  style="fauna"
/>}}
{{< /tab >}}

{{< /tabs >}}


##### Next.js
Create a new page `pages/login.js`. Add the following code to this file. You plug your *Login* component into your login page component.

##### Svelte.js
Create a new route `src/routes/login.svelte`. Add the following code to this file. You plug in the *Login* component.


{{< tabs groupId="frontend" >}}
{{% tab name="Next.js" %}}
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
{{% /tab %}}

{{% tab name="Svelte.js" %}}
```svelte
// src/routes/login.svelte

<script>
  import Login from '$lib/Login.svelte';
</script>

<Login />

```
{{% /tab %}}

{{< /tabs >}}




{{< tabs groupId="frontend" >}}

{{< tab name="Next.js" >}}
{{< attachments
  title="components/Login.js"
  pattern="pages-login.js" 
  style="fauna"
/>}}
{{< /tab >}}

{{< tab name="Svelte.js" >}}
{{< attachments
  title="src/routes/login.svelte"
  pattern="routes-login.svelte" 
  style="fauna"
/>}}
{{< /tab >}}

{{< /tabs >}}





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

---
[uikit]: https://getuikit.com/