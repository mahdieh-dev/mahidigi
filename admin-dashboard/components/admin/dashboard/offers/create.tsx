import { createOffer } from '@/lib/database/actions/admin/offers/offers.action'
import { Box, Button, FileInput, LoadingOverlay, Select, SimpleGrid, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { SetStateAction, useState } from 'react'

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject
    })
}

function CreateOffer({ setOffers }: { setOffers: React.Dispatch<SetStateAction<any>> }) {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])

    const form = useForm({
        initialValues: {
            title: "",
            offerType: null as string | null,
            files: [] as File[]
        },
        validate: {
            title: value => value.length < 3 || value.length > 50 ? "Title must be between 3 and 50 characters" : null,
            offerType: value => !value ? "Please select an offer type." : null,
            files: value => value.length === 0 ? "Please upload at least one image." : null
        }
    })

    const handleImageChange = async (files: File[]) => {
        form.setFieldValue("files", files)
        const base64Images = await Promise.all(files.map(fileToBase64))
        setImages(base64Images)
    }

    const submitHandler = async (values: typeof form.values) => {
        try {
            setLoading(true)
            await createOffer({ ...values, images }).then(res => {
                if (res.success) {
                    setOffers(res.offers)
                    form.reset()
                    setImages([])
                }
                alert(res.message)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className='titleStyle'>Create a Home Screen Offer</div>
            <Box pos={"relative"}>
                {loading && <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <TextInput label="Title" placeholder='Offer title' {...form.getInputProps("title")} required />
                    <Select label="Offer Type" placeholder='Select offer type' data={[
                        { value: "specialCombo", label: "Special Combo" },
                        { value: "crazyDeal", label: "Crazy Deal" },
                    ]} {...form.getInputProps("offerType")} required />
                    <FileInput multiple label="Upload Images for Offer" placeholder='Choose files (800width * 671height is recommended' {...form.getInputProps("files")} accept='image/*' onChange={handleImageChange} required />

                    <SimpleGrid cols={4} spacing={"md"} mt={"md"}>
                        {images.map((image, index) => (
                            <Box key={index} >
                                <img alt={`Uploaded image ${index + 1}`} src={image} className='w-full height-auto object-cover' />
                            </Box>
                        ))}
                    </SimpleGrid>

                    <div className='mt-4'>
                        <Button type="submit" className='text-white'>Add Offer</Button>
                    </div>
                </form>
            </Box>
        </div>
    )
}

export default CreateOffer
