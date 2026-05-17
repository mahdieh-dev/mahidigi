"use client"

import { createTopBar } from '@/lib/database/actions/admin/topbar/topbar.actions'
import { Box, Button, ColorInput, LoadingOverlay, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'

function CreateTopBar({ setTopBars }: { setTopBars: any }) {
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: "",
            color: "",
            btnText: "",
            btnColor: "",
            btnLink: "",
        },
        validate: {
            name: value => value.length < 5 ? "TopBar name must be 5 characters or more" : null
        }
    })

    const submitHandler = async (values: typeof form.values) => {
        try {
            setLoading(true)
            await createTopBar(values).then(res => {
                if (res.success) {
                    setTopBars(res.topBars)
                    form.reset()
                    alert(res.message)
                } else {
                    alert(res.message)
                    console.log(res)
                }
            })
        } catch (error) {
            console.log(error)
        } finally { setLoading(false) }
    }
    return (
        <div>
            <Box pos={"relative"}>
                {loading && (
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                )}
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <div className='titleStyle'>Create a TopBar</div>
                    <TextInput label="TopBar Title" placeholder='TopBar text' {...form.getInputProps("name")} />
                    <ColorInput label="Color" placeholder='Background Color of TopBar' {...form.getInputProps("color")} />
                    <TextInput label="Button Text" placeholder='Button text' {...form.getInputProps("btnText")} />
                    <ColorInput label="Button Color" placeholder='Button Color' {...form.getInputProps("btnColor")} />
                    <TextInput label="Button Link" placeholder='Button Link' {...form.getInputProps("btnLink")} />
                    <Button type='submit' className={"mt-4"}>Add TopBar</Button>
                </form>
            </Box>
        </div>
    )
}

export default CreateTopBar
