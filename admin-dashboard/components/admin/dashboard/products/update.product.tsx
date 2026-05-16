"use client"

import { updateProduct } from '@/lib/database/actions/admin/products/products.actions';
import { Alert, Box, Button, ColorInput, Group, LoadingOverlay, Text, Textarea, TextInput } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import JoditEditor from 'jodit-react';
import { useEffect, useRef, useState } from 'react'
import { IoIosInformationCircle } from 'react-icons/io';
import { IoAdd } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

interface FormValues {
    name: string;
    description: string;
    brand: string;
    sku: string;
    discount: number;
    imageFiles: File[];
    longDescription: string;
    color: {
        color: string;
        image: File | null;
    };
    parent: string;
    category: string;
    subCategories: string[];
    sizes: { size: string; qty: string; price: string }[];
    benefits: { name: string }[]
    ingredients: { name: string }[]
    questions: { question: string; answer: string }[]
    shippingFee: string;
    details: { name: string; value: string }[]
}

function UpdateProductComponent({ data, setOpened }: { data: any, setOpened: any }) {
    const { _id: productId } = data
    const [submittedValues, setSubmittedValues] = useState("")
    const [loading, setLoading] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const editor = useRef(null)

    const form = useForm<FormValues>({
        initialValues: {
            name: "",
            description: "",
            brand: "",
            sku: "",
            discount: 0,
            imageFiles: [],
            longDescription: "",
            color: {
                color: "",
                image: null,
            },
            parent: "",
            category: "",
            subCategories: [],
            sizes: [{ size: "", qty: "", price: "" }],
            benefits: [{ name: "" }],
            ingredients: [{ name: "" }],
            questions: [{ question: "", answer: "" }],
            shippingFee: "",
            details: [{ name: "", value: "" }]
        },
        validate: {
            name: hasLength({ min: 10, max: 100 }, "Must be at least 10 characters."),
            description: hasLength({ min: 10, max: 100 }, "Must be at least 10 characters."),
            imageFiles: (value: File[]) => value.length === 0 ? "You must upload at least one image." : null,
            color: {
                color: (value: string) => value === "" ? "You must select a color" : null,
                image: (value: File | null) => value === null ? "you must upload an image for the color." : null
            }
        }
    })

    useEffect(() => {
        setSubmittedValues(JSON.stringify(form.values, null, 2))
    }, [form.values])

    useEffect(() => {
        setDataLoaded(true)
    }, [data])

    // Update form values when data changes
    useEffect(() => {
        if (typeof data !== "undefined" && dataLoaded) {
            form.setValues(data)
        }
    }, [data])

    const handleSubmit = async (values: FormValues) => {
        setLoading(true)

        const updateProductHandler = async () => {
            try {
                await updateProduct(productId, { ...values, color: values.color.color }).then(res => {
                    if (res.success) {
                        alert(res.message)
                        setOpened(false)
                    }
                })
            } catch (error) {
                console.log("Error updating product:", error)
                alert(`Error: ${error?.message}`)
            } finally {
                setLoading(false)
            }
        }

        await updateProductHandler()
    }

    return (
        <div>
            <Alert variant='light' color='red' radius={"xs"} withCloseButton title="Alert" icon={<IoIosInformationCircle />}>
                Due to some of the restrictions, you cannot change product image, category, subCategories, product style images.
            </Alert>
            <div>
                <Box pos={"relative"}>
                    {loading && (
                        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    )}
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Box mb={"md"}>
                            <TextInput label="Product Name" placeholder='Enter product name' {...form.getInputProps("name")} />
                        </Box>
                        <Box mb="md">
                            <Textarea label="Description" placeholder='Enter product description' {...form.getInputProps("description")} />
                        </Box>
                        <Box mb="md">
                            <TextInput label="Brand" placeholder='Enter product brand' {...form.getInputProps("brand")} />
                        </Box>
                        <Box mb="md">
                            <TextInput label="SKU" placeholder='Enter product SKU' {...form.getInputProps("sku")} />
                        </Box>
                        <Box mb="md">
                            <TextInput label="Discount" placeholder='Enter product discount' {...form.getInputProps("discount")} />
                        </Box>
                        <Box mb="md">
                            <JoditEditor ref={editor} value={form.values.longDescription} onChange={content => form.setFieldValue("longDescription", content)} />
                        </Box>
                        <Box mb="md">
                            <ColorInput label="Select Color" {...form.getInputProps("color.color")} />
                        </Box>
                        <Box mb="md">
                            <Text>Product Sizes</Text>
                            {form.values.sizes.map((size, index) => {
                                return (
                                    <Group key={index}>
                                        <TextInput placeholder='Size' {...form.getInputProps(`sizes.${index}.size`)} />
                                        <TextInput placeholder='Quantity' {...form.getInputProps(`sizes.${index}.qty`)} />
                                        <TextInput placeholder='Price' {...form.getInputProps(`sizes.${index}.price`)} />
                                        <Button color="red" onClick={() => form.removeListItem("sizes", index)} >
                                            <MdDelete />
                                        </Button>
                                    </Group>
                                )
                            })}
                            <Button variant='outline' onClick={() => form.insertListItem("sizes", { size: "", qty: "", price: "" })}>
                                <IoAdd />
                            </Button>
                        </Box>
                        <Box mb="md">
                            <Text>Product Benefits</Text>
                            {form.values.benefits.map((benefit, index) => {
                                return (
                                    <Group key={index}>
                                        <TextInput placeholder='Benefit' {...form.getInputProps(`benefits.${index}.name`)} />
                                        <Button color="red" onClick={() => form.removeListItem("benefits", index)}>
                                            <MdDelete />
                                        </Button>
                                    </Group>
                                )
                            })}
                            <Button variant='outline' onClick={() => form.insertListItem("benefits", { name: "" })}>
                                <IoAdd />
                            </Button>
                        </Box>
                        <Box mb="md">
                            <Text>Product Ingredients</Text>
                            {form.values.ingredients.map((ingredient, index) => {
                                return (
                                    <Group key={index}>
                                        <TextInput placeholder='Ingredient' {...form.getInputProps(`ingredients.${index}.name`)} />
                                        <Button color="red" onClick={() => form.removeListItem("ingredients", index)}>
                                            <MdDelete />
                                        </Button>
                                    </Group>
                                )
                            })}
                            <Button variant='outline' onClick={() => form.insertListItem("ingredients", { name: "" })}>
                                <IoAdd />
                            </Button>
                        </Box>
                        <Box mb="md">
                            <Text>Product Questions</Text>
                            {form.values.questions.map((question, index) => {
                                return (
                                    <Group key={index}>
                                        <TextInput placeholder='Question' {...form.getInputProps(`questions.${index}.question`)} />
                                        <TextInput placeholder='Answer' {...form.getInputProps(`questions.${index}.answer`)} />
                                        <Button color="red" onClick={() => form.removeListItem("questions", index)}>
                                            <MdDelete />
                                        </Button>
                                    </Group>
                                )
                            })}
                            <Button variant='outline' onClick={() => form.insertListItem("questions", { question: "", answer: "" })}>
                                <IoAdd />
                            </Button>
                        </Box>
                        <Box mb="md">
                            <Text>Product Details</Text>
                            {form.values.details.map((detail, index) => {
                                return (
                                    <Group key={index}>
                                        <TextInput placeholder='Detail Name' {...form.getInputProps(`details.${index}.name`)} />
                                        <TextInput placeholder='Detail Value' {...form.getInputProps(`details.${index}.value`)} />
                                        <Button color="red" onClick={() => form.removeListItem("details", index)}>
                                            <MdDelete />
                                        </Button>
                                    </Group>
                                )
                            })}
                            <Button variant='outline' onClick={() => form.insertListItem("details", { name: "", value: "" })}>
                                <IoAdd />
                            </Button>
                        </Box>
                        <Group mt="md">
                            <button type="submit">Update Product</button>
                        </Group>
                    </form>
                </Box>
            </div>
        </div>
    )
}

export default UpdateProductComponent
