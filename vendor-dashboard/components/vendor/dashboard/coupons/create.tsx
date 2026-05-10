"use client"

import { createCoupon } from '@/lib/database/actions/vendor/coupon/coupon.actions'
import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { Box, Button, LoadingOverlay, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { DatePickerInput, DatesRangeValue } from "@mantine/dates"
import { useRouter } from 'next/navigation'

const CreateVendorCoupon = ({ setCoupons }: { setCoupons: any }) => {
    const [vendor, setVendor] = useState("")
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

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
                alert(error)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchVendorDetails()
    }, [])

    const form = useForm({
        initialValues: {
            name: "",
            discount: 0,
            dateRange: [null, null] as DatesRangeValue<string>
        },
        validate: {
            name: value => value.length < 5 || value.length > 10 ? "Coupon name must be between 5 to 10 characters." : null,
            discount: value => value < 1 || value > 99 ? "Discount must be between 1% to 90%." : null,
            dateRange: ([_startDate, _endDate]: DatesRangeValue<string>) => {
                const startDate = new Date(_startDate)
                const endDate = new Date(_endDate)
                if (!_startDate || !_endDate) {
                    return "Both start and end dates are required."
                }
                if (startDate.getTime() === endDate.getTime()) {
                    return "You can&apos;t pick same dates!";
                } else if (endDate.getTime() < startDate.getTime()) {
                    return "Start Date cannot be later than End Date!"
                }

                return null
            }
        }
    })

    const submitHandler = async (values: typeof form.values) => {
        if (!vendor) {
            alert("Vendor details not found. Please refresh the page.")
            return
        }
        try {
            setLoading(true)
            const [startDate, endDate] = values.dateRange;
            await createCoupon(values.name, values.discount, startDate, endDate, vendor).then(res => {
                console.log("Create coupon response: ", res)
                if (res.success) {
                    setCoupons(res.coupons)
                    form.reset()
                    alert(res.message)
                } else {
                    alert(res.message)
                }
            }).catch(err => {
                alert("Error" + err)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Box pos={"relative"}>
                {loading && (
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                )}
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <div className='titleStyle'>Create a Coupon</div>
                    <TextInput label="name" placeholder='Coupon name' {...form.getInputProps("name")} />
                    <NumberInput label="discount" placeholder='Discount' {...form.getInputProps("discount")} min={1} max={99} />
                    <DatePickerInput
                        type="range"
                        label="Date range"
                        placeholder="Pick start and end dates"
                        value={form.values.dateRange}
                        minDate={new Date()}
                        onChange={(value) => form.setFieldValue("dateRange", value)}
                        error={form.errors.dateRange}
                    />
                    <Button type='submit' className='mt-4'>Add Coupon</Button>
                </form>
            </Box>
        </div>
    )
}

export default CreateVendorCoupon