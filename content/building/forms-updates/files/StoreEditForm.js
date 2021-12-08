// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

// components/StoreEditForm.js

import { useState, useEffect } from 'react'
import { useMutation, useLazyQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';

const UPDATE_STORE = gql`
	mutation updateStore(
		$id: ID!
		$input: StoreInput!
	) {
		updateStore(data: $input, id: $id) {
			_id
			name
			email
			paymentMethods
			categories
			owner {
				_id
				email
			}
		}
  }
`;

const GET_CURRENT_STORE = gql`
	query GetCurrentStor($id: ID!) {
		findStoreByID(id: $id) {
			_id
			name
			email
			categories
			paymentMethods
			owner {
				_id
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

export default function StoreEditForm() {

	const [state, setState] = useState(INITAL_STATE)
	const [updateStore, { data: updatedStore }] = useMutation(UPDATE_STORE)
	const [getCurrentStore, { data: currentStore }] = useLazyQuery(GET_CURRENT_STORE)
	const router = useRouter()
	const { id } = router.query

	useEffect(() => {
		if(id) {
			getCurrentStore({
				variables: {
					id,
				}
			})
		}
	}, [id])

	useEffect(() => {
		if(currentStore) {
			const {paymentMethods, categories} = currentStore.findStoreByID
			setState({
				...currentStore.findStoreByID,
				paymentMethods: paymentMethods.toString(),
				categories: categories.toString()
			})
		}
	}, [currentStore])

	useEffect(() => {
		if(updatedStore) {
			alert('Store Updated')
		}
	}, [updatedStore])

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value
		})
	}
    
	const submit = e => {
		e.preventDefault()
		const cookies = Cookie.get('fauna-session')
		if(!cookies) {
			router.push('/login');
		}
			
		const ownerID = JSON.parse(cookies).ownerID;
		if(ownerID !== state.owner._id) {
			alert('This store does not belong to you')
			return;
		}

		updateStore({
			variables: {
				id,
				input: {
					name: state.name,
					email: state.email,
					categories: state.categories.split(','),
					paymentMethods: state.paymentMethods.split(',')
				}
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