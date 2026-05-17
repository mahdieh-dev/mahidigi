import React, { SetStateAction } from 'react'
import OfferListItem from './list.item'

function ListAllOffers({ offers, setOffers }: { offers: any, setOffers: React.Dispatch<SetStateAction<any>> }) {
    return (
        <div>
            <ul className='mt-4'>
                {
                    typeof offers !== "undefined" && offers?.map(offer => (
                        <OfferListItem offer={offer} key={offer._id} setOffers={setOffers} />
                    ))
                }
            </ul>
        </div>
    )
}

export default ListAllOffers
