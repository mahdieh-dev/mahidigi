"use client"

import { useState } from 'react'
import { hasLength, isEmail, useForm } from "@mantine/form"
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Box, Button, LoadingOverlay, Notification, NumberInput, Textarea, TextInput } from '@mantine/core'
import { loginAdmin } from '@/lib/database/actions/admin/auth/login'
const jwt = require("jsonwebtoken")

const SignInPage = () => {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: isEmail("Invalid Email."),
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
            await loginAdmin(values).then(res => {
                if (res.success) {
                    setSuccessMessage(true)
                    setFailureMessage({ visible: false, message: "" })
                    setTimeout(() => {
                        router.push("/admin/dashboard")
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
                    <h1 className='text-3xl font-bold mt-5'>Sign In</h1>
                    {
                        failureMessage.visible && (
                            <Notification color='red' title={"Error!"} mt={"md"}>
                                {failureMessage.message}
                            </Notification>
                        )
                    }
                    {
                        successMessage && (
                            <Notification color="teal" title="Successfully logged in." mt="md">
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
                            <TextInput {...form.getInputProps("password")} label="Password" placeholder='Password' required />
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

export default SignInPage
