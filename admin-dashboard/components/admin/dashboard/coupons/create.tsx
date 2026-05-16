"use client"

import { createCoupon } from '@/lib/database/actions/admin/coupon/coupon.actions'
import { Box, Button, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePickerInput, DatesRangeValue } from "@mantine/dates"

const CreateAdminCoupon = ({ setCoupons }: { setCoupons: any }) => {

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
        try {
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
        }
    }

    return (
        <div>
            <Box pos={"relative"}>
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

export default CreateAdminCoupon