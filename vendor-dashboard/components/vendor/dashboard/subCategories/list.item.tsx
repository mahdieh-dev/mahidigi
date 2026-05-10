import { deleteSubCategory, updateSubCategory } from "@/lib/database/actions/vendor/subCategories/subCategories.actions"
import { Button, Group, Text, TextInput } from "@mantine/core"
import { modals } from "@mantine/modals"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai"


const SubCategoryListItem = ({ subCategory, setSubCategory, categories }: { subCategory: any, categories: any, setSubCategories: any }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState("")
    const [parent, setParent] = useState("")

    const input = useRef<any>(null)
    const router = useRouter()

    const handleRemoveSubCategory = async (subCategoryId: string) => {
        try {
            await deleteSubCategory(subCategoryId).then(res => {
                if (res.success) {
                    setSubCategory(res.subCategories)
                    alert(res.message)
                }
            }).catch(alert)
        } catch (error: any) {
            console.log(error)
        }
    }

    const handleUpdateSubCategory = async (subCategoryId: string) => {
        try {
            const updatedParent = parent ?? null
            await updateSubCategory(subCategoryId, name || subCategory.name.toString(), updatedParent).then(res => {
                if (res.success) {
                    alert(res.message)
                    router.refresh()
                    setOpen(false)
                }
            }).catch(alert)
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div>
            <li className="flex p-2.5 bg-blue-400 mt-2.5 text-white font-bold items-center justify-between">
                <TextInput value={name.length ? name : subCategory.name} onChange={e => setName(e.target.value)} disabled={!open} ref={input} className={open ? "bg-white !text.black" : "text-white bg-transparent "} />
                {
                    open && (
                        <Group>
                            <select name="parent" value={parent || subCategory?.parent?._id} onChange={e => setParent(e.target.value)} disabled={!open} className="text-black h-13.75 pl-4 outline-none">
                                {categories?.map((c: any) => (
                                    <option value={c._id} key={c._id}>{c.name}</option>
                                ))}
                            </select>
                            <Button onClick={() => handleUpdateSubCategory(subCategory._id)}>Save</Button>
                            <Button color="red" onClick={() => { setOpen(false); setName("") }}>Cancel</Button>
                        </Group>
                    )
                }
                <div className="flex">
                    {!open && (
                        <AiTwotoneEdit className="w-5.5 h-5.5 cursor-pointer ml-4" onClick={() => { setOpen(prev => !prev); input?.current?.focus() }} />
                    )}
                    <AiFillDelete className="w-5.5 h-5.5 cursor-pointer ml-4" onClick={() => {
                        modals.openConfirmModal({
                            title: "Delete SubCategory",
                            centered: true,
                            children: (
                                <Text size="sm">Are you sure you want to delete SubCategory? This action is irreversible.</Text>
                            ),
                            labels: {
                                confirm: "Delete SubCategory",
                                cancel: "No don&apos;t delete it",
                            },
                            confirmProps: { color: "red" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => handleRemoveSubCategory(subCategory._id)
                        })
                    }} />
                </div>
            </li>
        </div>
    )
}

export default SubCategoryListItem