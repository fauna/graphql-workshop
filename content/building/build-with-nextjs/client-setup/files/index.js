// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// index.js

import styles from '../styles/Home.module.css'
import { useMutation, gql } from "@apollo/client";

const LOGIN = gql`
  mutation OwnerLogin($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      ttl
      secret
      email
    }
  }
`;

export default function Home() {

  const [loginFunc, { data, loading, error }] = useMutation(LOGIN)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const doLogin = e => {
    e.preventDefault();
    loginFunc({
        variables: {
          email: 'security@fauna-labs.com',
          password: 'qZXUEhaNdng9',
        }
    })
    .then(resp => console.log('==>', resp))
    .catch(e => console.log(e))   
  }

  return (
    <div className={styles.container}>
      <button onClick={doLogin}>Login</button>
    </div>
  )
}