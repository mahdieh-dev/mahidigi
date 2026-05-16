"use client"

import { createCategory } from "@/lib/database/actions/admin/category/category.actions";
import { LoadingOverlay, Box, TextInput, FileInput, SimpleGrid, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from 'react'


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })
}


const CreateCategory = ({ setCategories }: { setCategories?: any }) => {
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm({
        initialValues: {
            name: ""
        },
        validate: {
            name: value => value.length < 3 || value.length > 30 ?
                "Category name must be between 3 to 30 characters." : null
        }
    })

    const handleImageChange = async (files: File[] | null) => {
        if (!files) {
            setImages([])
            return
        }

        const base64Images = await Promise.all(files.map(fileToBase64))
        setImages(base64Images)
    }

    const submitHandler = async (values: typeof form.values) => {
        try {
            setLoading(true)
            await createCategory(values.name, images).then(res => {
                if (res?.success) {
                    setCategories(res.categories)
                    form.reset()
                    setImages([])
                    alert(res?.message)
                } else {
                    alert(res?.message)
                }
            })
        } catch (error: any) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="titleStyle">Create a Category</div>
            <Box pos={"relative"}>
                {
                    loading && (
                        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    )
                }
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <TextInput label="Name" placeholder="Category name" {...form.getInputProps("name")} required />
                    <FileInput label="Upload Images for Category" placeholder="Choose files" multiple accept="image/*" onChange={handleImageChange} required />

                    <SimpleGrid cols={4} spacing={'md'} mt={"md"}>
                        {images.map((image, index) => (
                            <Box key={index}>
                                <img src={image} alt={`Uploaded image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                            </Box>
                        ))}
                    </SimpleGrid>
                    <div className="mt-4">
                        <Button type="submit" className="text-white">
                            Add Category
                        </Button>
                    </div>
                </form>
            </Box>
        </div>
    )
}

export default CreateCategory