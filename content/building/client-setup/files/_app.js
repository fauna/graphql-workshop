// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// pages/_app.js

import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
