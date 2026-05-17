"use client"

import { updateProduct } from "@/lib/database/actions/admin/products/products.actions"
import {
    Alert,
    Box,
    Button,
    ColorInput,
    Group,
    LoadingOverlay,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core"
import { hasLength, useForm } from "@mantine/form"
import JoditEditor from "jodit-react"
import { useEffect, useRef, useState } from "react"
import { IoIosInformationCircle } from "react-icons/io"
import { IoAdd } from "react-icons/io5"
import { MdDelete } from "react-icons/md"

interface FormValues {
    name: string
    description: string
    brand: string
    sku: string
    discount: number
    imageFiles: File[]
    longDescription: string
    color: {
        color: string
        image: File | null
    }
    parent: string
    category: string
    subCategories: string[]
    sizes: { size: string; qty: string; price: string }[]
    benefits: { name: string }[]
    ingredients: { name: string }[]
    questions: { question: string; answer: string }[]
    shippingFee: string
    details: { name: string; value: string }[]
}

function UpdateProductComponent({
    data,
    setOpened,
}: {
    data: any
    setOpened: any
}) {
    const product = data?.product
    const selectedVariant = data?.selectedVariant
    const productId = product?._id

    const [submittedValues, setSubmittedValues] = useState("")
    const [loading, setLoading] = useState(false)

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
            details: [{ name: "", value: "" }],
        },

        validate: {
            name: hasLength(
                { min: 10, max: 100 },
                "Must be between 10 and 100 characters."
            ),

            description: hasLength(
                { min: 10, max: 100 },
                "Must be between 10 and 100 characters."
            ),

            color: {
                color: (value: string) =>
                    value === "" ? "You must select a color." : null,
            },
        },
    })

    useEffect(() => {
        setSubmittedValues(JSON.stringify(form.values, null, 2))
    }, [form.values])

    useEffect(() => {
        if (!product) return

        const firstSubProduct = product.subProducts?.[0]

        form.setValues({
            name: product.name || "",
            description: product.description || "",
            brand: product.brand || "",
            longDescription: product.longDescription || "",

            sku: firstSubProduct?.sku || "",

            discount: Number(
                selectedVariant?.discount ?? firstSubProduct?.discount ?? 0
            ),

            imageFiles: [],

            color: {
                color:
                    selectedVariant?.style?.color ||
                    firstSubProduct?.color?.color ||
                    "",
                image: null,
            },

            parent: product.parent?._id || product.parent || "",
            category: product.category?._id || product.category || "",

            subCategories: Array.isArray(product.subCategories)
                ? product.subCategories.map((sub: any) => String(sub?._id || sub))
                : [],

            sizes: firstSubProduct?.sizes?.length
                ? firstSubProduct.sizes.map((size: any) => ({
                    size: String(size.size || ""),
                    qty: String(size.qty ?? ""),
                    price: String(size.price ?? ""),
                }))
                : selectedVariant?.size
                    ? [
                        {
                            size: String(selectedVariant.size || ""),
                            qty: "",
                            price: String(selectedVariant.price ?? ""),
                        },
                    ]
                    : [{ size: "", qty: "", price: "" }],

            benefits: product.benefits?.length
                ? product.benefits.map((benefit: any) => ({
                    name: benefit.name || "",
                }))
                : [{ name: "" }],

            ingredients: product.ingredients?.length
                ? product.ingredients.map((ingredient: any) => ({
                    name: ingredient.name || "",
                }))
                : [{ name: "" }],

            questions: product.questions?.length
                ? product.questions.map((question: any) => ({
                    question: question.question || "",
                    answer: question.answer || "",
                }))
                : [{ question: "", answer: "" }],

            shippingFee: product.shippingFee || "",

            details: product.details?.length
                ? product.details.map((detail: any) => ({
                    name: detail.name || "",
                    value: detail.value || "",
                }))
                : [{ name: "", value: "" }],
        })
    }, [product, selectedVariant])

    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true)

            if (!productId) {
                alert("Product id not found.")
                return
            }

            const res = await updateProduct(productId, {
                ...values,

                color: values.color.color,

                sizes: values.sizes.map(size => ({
                    size: size.size,
                    qty: Number(size.qty),
                    price: Number(size.price),
                })),

                discount: Number(values.discount),
            })

            if (res.success) {
                alert(res.message)
                setOpened(false)
            } else {
                alert(res.message || "Update failed.")
            }
        } catch (error: any) {
            console.log("Error updating product:", error)
            alert(`Error: ${error?.message || "Something went wrong."}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Alert
                variant="light"
                color="red"
                radius="xs"
                withCloseButton
                title="Alert"
                icon={<IoIosInformationCircle />}
            >
                Due to some of the restrictions, you cannot change product image,
                category, subCategories, product style images.
            </Alert>

            <Box pos="relative" mt="md">
                {loading && (
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Box mb="md">
                        <TextInput
                            label="Product Name"
                            placeholder="Enter product name"
                            {...form.getInputProps("name")}
                        />
                    </Box>

                    <Box mb="md">
                        <Textarea
                            label="Description"
                            placeholder="Enter product description"
                            {...form.getInputProps("description")}
                        />
                    </Box>

                    <Box mb="md">
                        <TextInput
                            label="Brand"
                            placeholder="Enter product brand"
                            {...form.getInputProps("brand")}
                        />
                    </Box>

                    <Box mb="md">
                        <TextInput
                            label="SKU"
                            placeholder="Enter product SKU"
                            {...form.getInputProps("sku")}
                        />
                    </Box>

                    <Box mb="md">
                        <TextInput
                            label="Discount"
                            placeholder="Enter product discount"
                            {...form.getInputProps("discount")}
                        />
                    </Box>

                    <Box mb="md">
                        <Text size="sm" mb="xs">
                            Long Description
                        </Text>

                        <JoditEditor
                            ref={editor}
                            value={form.values.longDescription}
                            onBlur={content =>
                                form.setFieldValue("longDescription", content)
                            }
                        />
                    </Box>

                    <Box mb="md">
                        <ColorInput
                            label="Select Color"
                            {...form.getInputProps("color.color")}
                        />
                    </Box>

                    <Box mb="md">
                        <Text>Product Sizes</Text>

                        {form.values.sizes.map((size, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Size"
                                    {...form.getInputProps(`sizes.${index}.size`)}
                                />

                                <TextInput
                                    placeholder="Quantity"
                                    {...form.getInputProps(`sizes.${index}.qty`)}
                                />

                                <TextInput
                                    placeholder="Price"
                                    {...form.getInputProps(`sizes.${index}.price`)}
                                />

                                <Button
                                    type="button"
                                    color="red"
                                    onClick={() => form.removeListItem("sizes", index)}
                                    disabled={form.values.sizes.length === 1}
                                >
                                    <MdDelete />
                                </Button>
                            </Group>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            mt="xs"
                            onClick={() =>
                                form.insertListItem("sizes", {
                                    size: "",
                                    qty: "",
                                    price: "",
                                })
                            }
                        >
                            <IoAdd />
                        </Button>
                    </Box>

                    <Box mb="md">
                        <Text>Product Benefits</Text>

                        {form.values.benefits.map((benefit, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Benefit"
                                    {...form.getInputProps(`benefits.${index}.name`)}
                                />

                                <Button
                                    type="button"
                                    color="red"
                                    onClick={() => form.removeListItem("benefits", index)}
                                    disabled={form.values.benefits.length === 1}
                                >
                                    <MdDelete />
                                </Button>
                            </Group>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            mt="xs"
                            onClick={() =>
                                form.insertListItem("benefits", {
                                    name: "",
                                })
                            }
                        >
                            <IoAdd />
                        </Button>
                    </Box>

                    <Box mb="md">
                        <Text>Product Ingredients</Text>

                        {form.values.ingredients.map((ingredient, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Ingredient"
                                    {...form.getInputProps(`ingredients.${index}.name`)}
                                />

                                <Button
                                    type="button"
                                    color="red"
                                    onClick={() => form.removeListItem("ingredients", index)}
                                    disabled={form.values.ingredients.length === 1}
                                >
                                    <MdDelete />
                                </Button>
                            </Group>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            mt="xs"
                            onClick={() =>
                                form.insertListItem("ingredients", {
                                    name: "",
                                })
                            }
                        >
                            <IoAdd />
                        </Button>
                    </Box>

                    <Box mb="md">
                        <Text>Product Questions</Text>

                        {form.values.questions.map((question, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Question"
                                    {...form.getInputProps(`questions.${index}.question`)}
                                />

                                <TextInput
                                    placeholder="Answer"
                                    {...form.getInputProps(`questions.${index}.answer`)}
                                />

                                <Button
                                    type="button"
                                    color="red"
                                    onClick={() => form.removeListItem("questions", index)}
                                    disabled={form.values.questions.length === 1}
                                >
                                    <MdDelete />
                                </Button>
                            </Group>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            mt="xs"
                            onClick={() =>
                                form.insertListItem("questions", {
                                    question: "",
                                    answer: "",
                                })
                            }
                        >
                            <IoAdd />
                        </Button>
                    </Box>

                    <Box mb="md">
                        <Text>Product Details</Text>

                        {form.values.details.map((detail, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Detail Name"
                                    {...form.getInputProps(`details.${index}.name`)}
                                />

                                <TextInput
                                    placeholder="Detail Value"
                                    {...form.getInputProps(`details.${index}.value`)}
                                />

                                <Button
                                    type="button"
                                    color="red"
                                    onClick={() => form.removeListItem("details", index)}
                                    disabled={form.values.details.length === 1}
                                >
                                    <MdDelete />
                                </Button>
                            </Group>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            mt="xs"
                            onClick={() =>
                                form.insertListItem("details", {
                                    name: "",
                                    value: "",
                                })
                            }
                        >
                            <IoAdd />
                        </Button>
                    </Box>

                    <Group mt="md">
                        <Button type="submit" loading={loading}>
                            Update Product
                        </Button>
                    </Group>
                </form>
            </Box>
        </div>
    )
}

export default UpdateProductComponent