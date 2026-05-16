"use client"

import { createSubCategory } from '@/lib/database/actions/admin/subCategories/subCategories.actions'
import {
  Box,
  Button,
  FileInput,
  LoadingOverlay,
  Select,
  SimpleGrid,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

const CreateSubCategory = ({
  setSubCategories,
  categories
}: {
  setSubCategories?: any
  categories: any
}) => {
  const [images, setImages] = useState<string[]>([])
  const [files, setFiles] = useState<File[] | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      name: "",
      parent: null,
    },

    validate: {
      name: value =>
        value.length < 3 || value.length > 30
          ? "Category name must be between 3 to 30 characters."
          : null,

      parent: value =>
        value ? null : "Parent is required.",
    },
  })

  const handleImageChange = async (selectedFiles: File[] | null) => {
    setFiles(selectedFiles)

    if (!selectedFiles || selectedFiles.length === 0) {
      setImages([])
      return
    }

    const base64Images = await Promise.all(selectedFiles.map(fileToBase64))
    setImages(base64Images)
  }

  const submitHandler = async (values: typeof form.values) => {
    try {
      setLoading(true)

      if (!values.parent) {
        form.setFieldError("parent", "Parent is required.")
        return
      }

      const res = await createSubCategory(values.name, values.parent, images)

      if (res.success) {
        setSubCategories?.(res.subCategories)

        form.reset()
        setImages([])
        setFiles(null)

        alert(res.message)
      } else {
        alert(res.message)
      }
    } catch (error: any) {
      console.log(error)
      alert(error?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="titleStyle">Create a SubCategory</div>

      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <form onSubmit={form.onSubmit(submitHandler)}>
          <TextInput
            label="Name"
            placeholder="SubCategory name"
            {...form.getInputProps("name")}
            required
          />

          <FileInput
            label="Upload Images for SubCategory"
            placeholder="Choose files"
            multiple
            accept="image/*"
            value={files}
            onChange={handleImageChange}
            required
          />

          <Select
            label="Parent"
            placeholder="Select parent"
            data={
              categories?.map((category: any) => ({
                value: category._id,
                label: category.name,
              })) || []
            }
            clearable
            {...form.getInputProps("parent")}
            required
          />

          <SimpleGrid cols={4} spacing="md" mt="md">
            {images.map((image, index) => (
              <Box key={index}>
                <img
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </Box>
            ))}
          </SimpleGrid>

          <div className="mt-4">
            <Button type="submit" className="text-white">
              Add SubCategory
            </Button>
          </div>
        </form>
      </Box>
    </div>
  )
}

export default CreateSubCategory