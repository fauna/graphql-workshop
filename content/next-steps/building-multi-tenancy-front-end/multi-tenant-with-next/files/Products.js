// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

export default function Products({products}) {
  const palceHolder = 'https://images.unsplash.com/photo-1636390785299-b4df455163dd';
  return (
    <div className="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center" uk-grid="true">
      {
        products.map(product => (
          <div key={product._id}>
            <div className="uk-card uk-card-hover uk-card-body">
              <h3 className="uk-card-title">{product.name}</h3>
              <img src={product.image ? product.image : palceHolder} />
              <p>{product.description}</p>
              <a className="uk-button uk-button-primary">Buy</a>
            </div>
          </div> 
        ))
      }
    </div>
  )
}