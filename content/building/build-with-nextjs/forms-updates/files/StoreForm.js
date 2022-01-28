// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// components/StoreForm.js

import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import Cookie from 'js-cookie';

const CREATE_NEW_STORE = gql`
    mutation CreateNewStore($name: String!, $email: String!, $categories: [String], $paymentMethods: [String] $ownerID: ID!) {
			createStore(data: {
				name: $name,
				email: $email,
				categories: $categories,
				paymentMethods: $paymentMethods
				owner: {
						connect: $ownerID
				}
			}) {
				_id
				name
				email
				categories
				paymentMethods
				owner {
						_id
						email
				}
			}
    }
`;

const INITAL_STATE = {
	name: '',
	email: '',
	paymentMethods: '',
	categories: ''
}

export default function StoreForm() {

	const [state, setState] = useState(INITAL_STATE)
	const [createNewStore, { data, loading, error }] = useMutation(CREATE_NEW_STORE)

	useEffect(() => {
		if(data) {
			alert('New Store Added')
			setState(INITAL_STATE)
		}
	}, [data])

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value
		})
	}
    
	const submit = e => {
		e.preventDefault()
		const cookies = Cookie.get('fauna-session')
		createNewStore({
			variables: {
				...state,
				ownerID: JSON.parse(cookies).ownerID,
				categories: state.categories.split(','),
				paymentMethods: state.paymentMethods.split(',')
			}
		}).catch(e => console.log(e));
	}

    return (
			<div className="uk-container uk-background-muted" style={{ marginTop: '20px', padding: '20px' }}>
				<form onSubmit={submit}>
					<div className="uk-margin">
						<label >Name</label>
						<input 
							className="uk-input" 
							type="text" 
							placeholder="My Store" 
							name="name"
							onChange={handleChange}
							value={state.name}
						/>
					</div>
					<div className="uk-margin">
						<label >Email</label>
						<input 
							className="uk-input" 
							type="text" 
							placeholder="jon@email.com" 
							name="email"
							onChange={handleChange}
							value={state.email}
						/>
					</div>
					<div className="uk-margin">
						<label >Payment methods (seperated by commas)</label>
						<input 
							className="uk-input" 
							type="text" 
							placeholder="Payment methods" 
							name="paymentMethods"
							onChange={handleChange}
							value={state.paymentMethods}
						/>
					</div>
					<div className="uk-margin">
						<label >Categories (seperated by commas)</label>
						<input 
							className="uk-input" 
							type="text" 
							placeholder="Categories" 
							name="categories"
							onChange={handleChange}
							value={state.categories}
						/>
					</div>
					<div className="uk-margin">
						<input className="uk-input" type="submit" />
					</div>
				</form>
			</div>
    );
}