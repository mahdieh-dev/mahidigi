"use client"

import {
    createProduct,
    getParentsAndCategories,
    getSingleProductById,
} from "@/lib/database/actions/admin/products/products.actions"
import { getSubCategoriesByCategoryParent } from "@/lib/database/actions/admin/subCategories/subCategories.actions"
import {
    Box,
    Button,
    FileInput,
    Group,
    LoadingOverlay,
    MultiSelect,
    NumberInput,
    Select,
    SimpleGrid,
    Text,
    TextInput,
} from "@mantine/core"
import { hasLength, useForm } from "@mantine/form"
import { useCallback, useEffect, useRef, useState } from "react"
import { IoAdd } from "react-icons/io5"
import { MdDelete } from "react-icons/md"
import JoditEditor from "jodit-react"

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

const CreateProductForAdminPage = () => {
    const [images, setImages] = useState<string[]>([])
    const [colorImagePreview, setColorImagePreview] = useState<string>("")
    const [parents, setParents] = useState<{ _id: string; name: string }[]>([])
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
    const [subs, setSubs] = useState<any[]>([])
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

            imageFiles: value =>
                value.length === 0 ? "You must upload at least one image." : null,

            category: value =>
                value === "" ? "You must select a category." : null,

            subCategories: value =>
                value.length === 0 ? "You must select at least one subCategory." : null,

            color: {
                color: value =>
                    value === "" ? "You must select a color." : null,

                image: value =>
                    value === null ? "You must upload an image for the color." : null,
            },
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getParentsAndCategories()

                if (res?.success) {
                    setParents(res.parents || [])
                    setCategories(res.categories || [])
                }
            } catch (error) {
                console.log(error)
                alert(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const getSubs = async () => {
            try {
                const res = await getSubCategoriesByCategoryParent(form.values.category)

                if (res?.success) {
                    setSubs(res.subCategories || [])
                }
            } catch (error) {
                console.log(error)
                alert(error)
            }
        }

        if (form.values.category) {
            getSubs()
        } else {
            setSubs([])
            form.setFieldValue("subCategories", [])
        }
    }, [form.values.category])

    useEffect(() => {
        const fetchParentData = async () => {
            if (!form.values.parent) return

            try {
                setLoading(true)

                const data = await getSingleProductById(form.values.parent, 0, 0)

                if (data?.success && data?.product) {
                    form.setValues({
                        ...form.values,
                        ...data.product,
                    })
                }
            } catch (error) {
                console.log("Error fetching parent data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchParentData()
    }, [form.values.parent])

    const handleImageChange = useCallback(
        (files: File[] | null) => {
            if (!files || files.length === 0) {
                setImages([])
                form.setFieldValue("imageFiles", [])
                return
            }

            const previewUrls = files.map(file => URL.createObjectURL(file))

            setImages(previewUrls)
            form.setFieldValue("imageFiles", files)
        },
        [form]
    )

    const handleColorImageChange = useCallback(
        (file: File | null) => {
            if (!file) {
                setColorImagePreview("")
                form.setFieldValue("color.image", null)
                return
            }

            const previewUrl = URL.createObjectURL(file)

            setColorImagePreview(previewUrl)
            form.setFieldValue("color.image", file)
        },
        [form]
    )

    const uploadProductImages = async (files: File[]) => {
        const uploadedImages = []

        for (const file of files) {
            const formData = new FormData()

            formData.append("file", file)
            formData.append("upload_preset", "website")

            const uploadResponse = await fetch(
                "https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            )

            const uploadData = await uploadResponse.json()

            if (!uploadResponse.ok) {
                throw new Error(uploadData?.error?.message || "Image upload failed.")
            }

            uploadedImages.push({
                url: uploadData.secure_url,
                public_id: uploadData.public_id,
            })
        }

        return uploadedImages
    }

    const uploadColorImage = async (file: File) => {
        const formData = new FormData()

        formData.append("file", file)
        formData.append("upload_preset", "website")

        const uploadResponse = await fetch(
            "https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload",
            {
                method: "POST",
                body: formData,
            }
        )

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
            throw new Error(uploadData?.error?.message || "Color image upload failed.")
        }

        return uploadData.secure_url
    }

    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true)

            if (!values.imageFiles.length) {
                alert("No image files are selected.")
                return
            }

            if (!values.color.image) {
                alert("No color image selected.")
                return
            }

            const uploadedImages = await uploadProductImages(values.imageFiles)
            const styleImage = await uploadColorImage(values.color.image)

            const productDetails = {
                parent: values.parent,
                sku: values.sku,

                color: {
                    image: styleImage,
                    color: values.color.color,
                },

                images: uploadedImages,
                sizes: values.sizes.map(size => ({
                    size: size.size,
                    qty: Number(size.qty),
                    price: Number(size.price),
                })),

                discount: Number(values.discount),
                name: values.name,
                description: values.description,
                brand: values.brand,
                details: values.details,
                questions: values.questions,
                category: values.category,
                subCategories: values.subCategories,
                benefits: values.benefits,
                ingredients: values.ingredients,
                longDescription: values.longDescription,
            }

            console.log("PRODUCT DETAILS BEFORE CREATE:", productDetails)
            console.log("UPLOADED PRODUCT IMAGES:", uploadedImages)

            const response = await createProduct(productDetails)

            if (response.success) {
                alert(response.message || "Product created successfully.")

                form.reset()
                setImages([])
                setColorImagePreview("")
            } else {
                alert(response.message || "An error occurred.")
            }
        } catch (error: any) {
            console.log(error)
            alert(error?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const addSize = () => {
        form.insertListItem("sizes", { size: "", qty: "", price: "" })
    }

    const addBenefit = () => {
        form.insertListItem("benefits", { name: "" })
    }

    const addDetail = () => {
        form.insertListItem("details", { name: "", value: "" })
    }

    return (
        <div>
            <div className="titleStyle">Create a Product</div>

            <Box pos="relative">
                {loading && (
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                )}

                <form onSubmit={form.onSubmit(handleSubmit)} className="w-[80%]">
                    <TextInput
                        {...form.getInputProps("name")}
                        mt="md"
                        label="Name"
                        placeholder="Name"
                        required
                    />

                    <TextInput
                        {...form.getInputProps("description")}
                        label="Description"
                        placeholder="Description"
                        required
                    />

                    <TextInput
                        {...form.getInputProps("brand")}
                        label="Brand"
                        placeholder="Brand"
                    />

                    <TextInput
                        {...form.getInputProps("sku")}
                        label="SKU"
                        placeholder="SKU"
                        required
                    />

                    <NumberInput
                        {...form.getInputProps("discount")}
                        mt="md"
                        label="Discount"
                        placeholder="Discount"
                        min={0}
                        max={99}
                        required
                    />

                    <TextInput
                        {...form.getInputProps("color.color")}
                        label="Select Color"
                        description="Pick a color for the product"
                        placeholder="Example: #ff1493"
                        required
                    />

                    <FileInput
                        label="Pick a product style image"
                        placeholder="Choose file"
                        accept="image/*"
                        value={form.values.color.image}
                        onChange={file => handleColorImageChange(file)}
                        required
                        error={form.errors["color.image"]}
                    />

                    {colorImagePreview && (
                        <Box mt="md">
                            <Text size="sm" mb="xs">
                                Color image preview
                            </Text>

                            <img
                                src={colorImagePreview}
                                alt="Color preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </Box>
                    )}

                    {parents.length > 0 && (
                        <Select
                            {...form.getInputProps("parent")}
                            label="Parent"
                            placeholder="Select a parent"
                            data={parents.map(parent => ({
                                value: parent._id,
                                label: parent.name,
                            }))}
                            clearable
                        />
                    )}

                    {categories.length > 0 && (
                        <Select
                            {...form.getInputProps("category")}
                            label="Category"
                            placeholder="Select a category"
                            data={categories.map(category => ({
                                value: category._id,
                                label: category.name,
                            }))}
                            required
                        />
                    )}

                    <MultiSelect
                        {...form.getInputProps("subCategories")}
                        label="SubCategories"
                        placeholder="Pick subCategories"
                        data={subs.map(sub => ({
                            value: sub._id,
                            label: sub.name,
                        }))}
                        required
                    />

                    <div>
                        <Text size="md" mb="xs" mt="md">
                            Sizes
                        </Text>

                        {form.values.sizes.map((item, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Size"
                                    {...form.getInputProps(`sizes.${index}.size`)}
                                    required
                                />

                                <TextInput
                                    placeholder="Quantity"
                                    {...form.getInputProps(`sizes.${index}.qty`)}
                                    required
                                />

                                <TextInput
                                    placeholder="Price"
                                    {...form.getInputProps(`sizes.${index}.price`)}
                                    required
                                />

                                <Button variant="outline" type="button" onClick={addSize}>
                                    <IoAdd size={20} color="blue" />
                                </Button>

                                <Button
                                    color="red"
                                    variant="outline"
                                    type="button"
                                    onClick={() => form.removeListItem("sizes", index)}
                                    disabled={form.values.sizes.length === 1}
                                >
                                    <MdDelete color="red" size={20} />
                                </Button>
                            </Group>
                        ))}
                    </div>

                    <div>
                        <Text size="md" mb="xs" mt="md">
                            Benefits
                        </Text>

                        {form.values.benefits.map((item, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Name"
                                    {...form.getInputProps(`benefits.${index}.name`)}
                                    required
                                />

                                <Button variant="outline" type="button" onClick={addBenefit}>
                                    <IoAdd size={20} color="blue" />
                                </Button>

                                <Button
                                    color="red"
                                    variant="outline"
                                    type="button"
                                    onClick={() => form.removeListItem("benefits", index)}
                                    disabled={form.values.benefits.length === 1}
                                >
                                    <MdDelete color="red" size={20} />
                                </Button>
                            </Group>
                        ))}
                    </div>

                    <div>
                        <Text size="md" mb="xs" mt="md">
                            Details
                        </Text>

                        {form.values.details.map((item, index) => (
                            <Group key={index} mt="xs">
                                <TextInput
                                    placeholder="Name"
                                    {...form.getInputProps(`details.${index}.name`)}
                                    required
                                />

                                <TextInput
                                    placeholder="Value"
                                    {...form.getInputProps(`details.${index}.value`)}
                                    required
                                />

                                <Button variant="outline" type="button" onClick={addDetail}>
                                    <IoAdd size={20} color="blue" />
                                </Button>

                                <Button
                                    color="red"
                                    variant="outline"
                                    type="button"
                                    onClick={() => form.removeListItem("details", index)}
                                    disabled={form.values.details.length === 1}
                                >
                                    <MdDelete color="red" size={20} />
                                </Button>
                            </Group>
                        ))}
                    </div>

                    <div>
                        <Text size="md" mb="xs" mt="md">
                            Long Description
                        </Text>

                        <JoditEditor
                            ref={editor}
                            value={form.values.longDescription}
                            onBlur={newContent =>
                                form.setFieldValue("longDescription", newContent)
                            }
                        />
                    </div>

                    <FileInput
                        label="Upload images"
                        placeholder="Choose files"
                        multiple
                        accept="image/*"
                        value={form.values.imageFiles}
                        onChange={files => handleImageChange(files)}
                        required
                        error={form.errors.imageFiles}
                    />

                    <SimpleGrid cols={4} spacing="md" mt="md">
                        {images.map((image, index) => (
                            <Box key={index}>
                                <img
                                    src={image}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="w-full h-auto object-cover rounded"
                                />
                            </Box>
                        ))}
                    </SimpleGrid>

                    <Button type="submit" mt="md">
                        {loading ? "Loading..." : "Submit"}
                    </Button>
                </form>
            </Box>
        </div>
    )
}

export default CreateProductForAdminPage