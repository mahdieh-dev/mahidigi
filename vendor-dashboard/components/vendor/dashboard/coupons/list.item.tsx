import { deleteCoupon, updateCoupon } from '@/lib/database/actions/vendor/coupon/coupon.actions'
import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { Button, Group, NumberInput, Text, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import React, { useEffect, useState } from 'react'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'

function CouponListItem({ coupon, setCoupons }: { coupon: any, setCoupons: any }) {
    const [vendor, setVendor] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                setLoading(true)
                await getVendorCookiesAndFetchVendor().then(res => {
                    if (res.success) {
                        setVendor(res.vendor._id)
                    }
                }).catch(alert)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchVendorDetails()
    }, [])

    const getCouponFormValues = (coupon: any) => ({
        name: coupon.coupon,
        discount: coupon.discount,
        dateRange: [new Date(coupon.startDate), new Date(coupon.endDate)] as [Date, Date],
    })

    const form = useForm({
        initialValues: getCouponFormValues(coupon),
        validate: {
            name: value => value.length < 5 || value.length > 10 ? "Coupon name must be between 5 to 10 characters" : null,
            discount: value => value < 1 || value > 99 ? "Discount must be between 1% and 99%." : null,
            dateRange: ([startDate, endDate]) => {
                if (!startDate || !endDate) {
                    return "Both start and end dates are required."
                }
                if (startDate.getTime() === endDate.getTime()) {
                    return "You can&apos;t pick same dates!"
                } else if (endDate.getTime() < startDate.getTime()) {
                    return "Start date cannot be later than end date!"
                }

                return null;
            }
        }
    })

    useEffect(() => {
        const nextValues = getCouponFormValues(coupon)

        form.setValues(nextValues)
        form.resetDirty(nextValues)
    }, [coupon])

    const handleRemoveCoupon = async (couponId: string) => {
        try {
            setLoading(true)
            await deleteCoupon(couponId, vendor).then(res => {
                if (res.success) {
                    setCoupons(res.coupons)
                    alert(res.message)
                } else {
                    alert(res.message)
                }
            }).catch(alert)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCoupon = async (couponId: string) => {
        try {
            setLoading(true)
            const { name, discount, dateRange } = form.values
            const [startDate, endDate] = dateRange
            await updateCoupon(couponId, name, discount, startDate, endDate, vendor).then(res => {
                if (res.success) {
                    alert(res.message)
                    setCoupons(res?.coupons)
                    setOpen(false)
                } else {
                    alert(res.message)
                }
            }).catch(alert)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <li className='flex p-2.5 bg-blue-400 text-white font-bold items-center justify-between'>
                <TextInput value={form.values.name} onChange={e => form.setFieldValue("name", e.target.value)} disabled={!open} className={open ? "bg-white text-black!" : "text-white bg-transparent"} />
                {open && (
                    <Group>
                        <NumberInput value={form.values.discount} onChange={val => form.setFieldValue("discount", val)} min={1} max={99} className={open ? "bg-white! text-black!" : "text-white bg-transparent"} />
                        <DatePickerInput type="range" value={form.values.dateRange} onChange={val => form.setFieldValue("dateRange", val)} minDate={new Date()} />
                        <Button onClick={() => handleUpdateCoupon(coupon._id)}>Save</Button>
                        <Button color="red" onClick={() => { setOpen(false); form.reset() }}>Cancel</Button>
                    </Group>
                )}
                <div className='flex ml-4'>
                    {form.values.discount + "%"}
                    {!open && (
                        <AiTwotoneEdit className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => setOpen(prev => !prev)} />
                    )}
                    <AiFillDelete className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => {
                        modals.openConfirmModal({
                            title: "Delete coupon",
                            centered: true,
                            children: (
                                <Text size='sm'>Are you sure you want to delete coupon? This action is irreversible.</Text>
                            ),
                            labels: {
                                confirm: "Delete coupon",
                                cancel: "no don&apos;t delete it."
                            },
                            confirmProps: { color: "red" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => handleRemoveCoupon(coupon._id),
                        })
                    }} />
                </div>
            </li>
        </div>
    )
}

export default CouponListItem
