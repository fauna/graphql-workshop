---
title: "Frontend forms and updates"
date: 2021-10-13T13:35:32-04:00
draft: false
weight: 60
pre: "<b>e. </b>"
---

This chapter builds the front-end functionality to *create*, *delete*, and *update* store data in Fauna.

Create a new file, `pages/store/new.js`, and add the following code.

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import Layout from '../../components/Layout';
import StoreForm from '../../components/StoreForm'

export default function NewStorePage() {
	return (
		<Layout>
			<StoreForm />
		</Layout>
	)
} 
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
      title="pages/new.js"
      pattern="new.js" 
      style="fauna"
/>}}

Next, create a new form component. Create a new file, `components/StoreForm.js`, and add the following code. 

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}
import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import Cookie from 'js-cookie';

const CREATE_NEW_STORE = gql`
	mutation CreateNewStore(
		$name: String!, 
		$email: String!,
		$categories: [String], 
		$paymentMethods: [String] $ownerID: ID!) {
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
		console.log('--->', cookies);
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
	title="components/StoreForm.js"
	pattern="StoreForm.js" 
	style="fauna"
/>}}

Create a view for editing a store. Create a new file `pages/store/[id]/edit.js`. Add the following code snippet to this file.

{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}

// pages/store/[id]/edit.js

import Layout from '../../../components/layout';
import StoreEditForm from '../../../components/StoreEditForm'

export default function EditStorePage() {
	return (
		<Layout>
			<StoreEditForm />
		</Layout>
	)
}


{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}


{{< attachments
	title="components/StoreForm.js"
	pattern="edit.js" 
	style="fauna"
/>}}


Create a new form component to edit store information. Create a new file, `components/StoreEditForm.js`. Add the following code snippet to your file.
{{< tabs groupId="frontend" >}}
{{< tab name="Next.js" >}}
{{< highlight jsx >}}

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

{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< attachments
	title="components/StoreEditForm.js"
	pattern="StoreEditForm.js" 
	style="fauna"
/>}}

Fauna allows fine-grained access control. You can set access rules (predicates) so that users can only modify their data and not others. 

Head over to the Fauna dashboard. Navigate to *Security > Roles > AuthUserRole*. Expand the store collection. Add the following rules to your *write* access.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda(
  ["oldData", "newData"],
  And(
    Equals(Identity(), Select(["data", "owner"], Var("oldData"))),
    Equals(
      Select(["data", "owner"], Var("oldData")),
      Select(["data", "owner"], Var("newData"))
    )
  )
)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

{{< figure
  src="./images/add-write-predicate.png" 
  alt="Add write predicate"
>}}

The rule defines that only a store's owner can update that store.  

Similarly, add the following predicate for *delete*. This rule defines that only a store's owner can delete a store. 

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda("ref", Equals(
  Identity(), // logged in user
  Select(["data", "owner"], Get(Var("ref")))
))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Add a predicate for *create* as well. The following rule ensures that logged-in users can add store and owner *id* is associated with a store when it is created.

{{< tabs groupId="UDFs" >}}
{{< tab name="FQL" >}}
{{< highlight js >}}
Lambda("values", Equals(Identity(), Select(["data", "owner"], Var("values"))))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Select *Save* to save your access control rules. Now, users can only modify or delete their data from your front end.

In this chapter, you learned how to apply fine-grained access control to your data. In the next chapter, you learn more about custom resolvers and Fauna Query Language (FQL).
