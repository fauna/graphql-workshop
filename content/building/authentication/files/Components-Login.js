// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

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
