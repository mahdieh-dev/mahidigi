"use client"

import { deleteCategory, updateCategory } from "@/lib/database/actions/admin/category/category.actions";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai"

const CategoryListItem = ({ category, setCategories }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState("")
    const input = useRef(null)
    const router = useRouter()

    const handleRemoveCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId).then(res => {
                if (res?.success) {
                    setCategories(res.categories)
                    alert(res.message)
                }
            }).catch(alert)
        } catch (error: any) {
            console.log(error)
            alert(error)
        }
    }

    const handleUpdateCategory = async (categoryId: string) => {
        try {
            await updateCategory(categoryId, name).then(res => {
                if (res?.success) {
                    setCategories(res.categories)
                    setOpen(false)
                    setName("")
                    alert(res.message)
                    router.refresh()
                }
            })
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <li className="flex p-2.5 bg-blue-400 mt-2.5 text-white font-bold items-center justify-between">
                <TextInput
                    value={name ? name : category.name}
                    onChange={e => setName(e.target.value)}
                    disabled={!open}
                    ref={input}
                    className={open ? "bg-white !text-black" : "text-white bg-transparent"}
                />
                {
                    open && (
                        <Group>
                            <Button onClick={() => handleUpdateCategory(category._id)}>Save</Button>
                            <Button color="red" onClick={() => {
                                setOpen(false)
                                setName("")
                            }}>Cancel</Button>
                        </Group>
                    )
                }
                <div className="flex">
                    {
                        !open && (
                            <AiTwotoneEdit
                                className="w-5.5 h-5.5 cursor-pointer ml-4"
                                onClick={() => {
                                    setOpen(prev => !prev)
                                    input?.current?.focus()
                                }}
                            />
                        )
                    }
                    <AiFillDelete
                        className="w-5.5 h-5.5 cursor-pointer ml-4"
                        onClick={() => {
                            modals.openConfirmModal({
                                title: "Delete category",
                                centered: true,
                                children: (
                                    <Text size="sm">
                                        Are you sure you want to delete category? This action is irreversible!
                                    </Text>
                                ),
                                labels: {
                                    confirm: "Delete category",
                                    cancel: "No don't delete it"
                                },
                                confirmProps: { color: "red" },
                                onCancel: () => console.log("Cancel"),
                                onConfirm: () => handleRemoveCategory(category._id)
                            })
                        }}
                    />
                </div>
            </li>
        </div>
    )
}

export default CategoryListItem