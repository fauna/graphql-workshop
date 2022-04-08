// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

export default function ShopList({ shops }) {
  return (
    <div className="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center" uk-grid="true">
      {
      shops.map(shop => (
        <div key={shop._id}>
          <div className="uk-card uk-card-hover uk-card-body">
            <h3 className="uk-card-title">{shop.name}</h3>
            <a className="uk-button uk-button-primary" href={`/store/${shop._id}?publicKey=${shop.publicKey}`} target="_blank" rel="noreferrer">Visit</a>
          </div>
        </div> 
      ))
      }
    </div>
  )
}