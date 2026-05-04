"use client"

import React, { useState } from 'react'
import { hasLength, isEmail, useForm } from "@mantine/form"
import { useRouter } from 'next/navigation'
import { registerVendor } from '@/lib/database/actions/vendor/auth/register'
import Navbar from '@/components/navbar'
import { Box, Button, LoadingOverlay, Notification, NumberInput, Textarea, TextInput } from '@mantine/core'


const SignUpPage = () => {
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
            description: "",
            address: "",
            phoneNumber: 0,
            zipCode: 0
        },
        validate: {
            name: hasLength({ min: 8 }, "Must be at least 8 characters long."),
            email: isEmail("Invalid Email."),
            password: hasLength({ min: 10 }, "Password must be at least 10 characters long."),
            address: hasLength({ min: 15 }, "Must be at least 15 characters long.")
        }
    })

    const [successMessage, setSuccessMessage] = useState(false)
    const [failureMessage, setFailureMessage] = useState<{ visible: boolean, message: string | undefined }>({ visible: false, message: "" })
    const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setLoading(true)
            await registerVendor(values).then(res => {
                if (res.success) {
                    setSuccessMessage(true)
                    setFailureMessage({ visible: false, message: "" })
                    setTimeout(() => {
                        router.push("/vendor/dashboard")
                    }, 3000);
                } else if (!res.success) {
                    setSuccessMessage(false)
                    setFailureMessage({ visible: true, message: res.message })
                }
            })
        } catch (error: any) {
            setFailureMessage({ visible: true, message: error.toString() })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex justify-center'>
                <div>
                    <h1 className='text-3xl font-bold mt-5'>Sign Up</h1>
                    {
                        failureMessage.visible && (
                            <Notification color='red' title={"Error!"} mt={"md"}>
                                {failureMessage.message}
                            </Notification>
                        )
                    }
                    {
                        successMessage && (
                            <Notification color="teal" title="Successfully sent verification request to an admin." mt="md">
                                You&apos;re being redirected to the dashboard
                            </Notification>
                        )
                    }
                    <Box pos={"relative"}>
                        {
                            loading && (<LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "5m", blur: 2 }} />)
                        }
                        <form onSubmit={form.onSubmit((values) => {
                            setSubmittedValues(values)
                            handleSubmit(values)
                        })} className='w-125'>
                            <TextInput {...form.getInputProps("email")} mt={"md"} label={"Email"} placeholder='Email' required />
                            <TextInput {...form.getInputProps("name")} label="Name" placeholder='Name' required />
                            <TextInput {...form.getInputProps("password")} label="Password" placeholder='Password' required />
                            <NumberInput {...form.getInputProps("phoneNumber")} mt={"md"} label="Phone Number" placeholder='Phone Number' required />
                            <NumberInput {...form.getInputProps("zipCode")} mt={"md"} label="Zip Code" placeholder='Zip Code' required />
                            <Textarea {...form.getInputProps("address")} label="Address" placeholder='Address' required />
                            <Textarea {...form.getInputProps("description")} label="Description" placeholder='Description' />
                            <Button type="submit" mt={"md"}>
                                {loading ? "Loading..." : "Submit"}
                            </Button>
                        </form>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
