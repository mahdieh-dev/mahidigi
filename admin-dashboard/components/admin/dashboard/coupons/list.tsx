
import React from 'react'
import CouponListItem from './list.item'

const ListAllAdminCoupons = ({ coupons, setCoupons }: { coupons: any, setCoupons: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <div>
            <ul className='mt-4'>
                {
                    coupons?.map(coupon => (
                        <CouponListItem coupon={coupon} key={coupon._id} setCoupons={setCoupons} />
                    ))
                }
            </ul>
        </div>
    )
}

export default ListAllAdminCoupons