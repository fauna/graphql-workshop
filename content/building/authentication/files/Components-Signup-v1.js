// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// components/Signup.js

import { useState, useEffect } from 'react'

const INITAL_STATE = {
  name: '',
  email: '',
  password: '',
}

export default function Signup() {

  let data;
  
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