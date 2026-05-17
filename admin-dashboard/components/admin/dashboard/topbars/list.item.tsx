import { deleteTopBar, updateTopBar } from '@/lib/database/actions/admin/topbar/topbar.actions'
import { Button, ColorInput, Group, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import React, { SetStateAction, useState } from 'react'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'

function TopBarListItem({ topBar, setTopBars }: { topBar: any, setTopBars: React.Dispatch<SetStateAction<any>> }) {
    const [open, setOpen] = useState(false)

    const form = useForm({
        initialValues: {
            name: topBar.title,
            color: topBar.color,
            btnText: topBar.button.title,
            btnColor: topBar.button.color,
            btnLink: topBar.button.link,
        },
        validate: {
            name: value => value.length < 5 ? "Name must be 5 characters or more" : null
        }
    })

    const handleRemoveTopBar = async (topBarId: string) => {
        try {
            await deleteTopBar(topBarId).then(res => {
                if (res.success) {
                    setTopBars(res.topBars)
                }
                alert(res.message)
            }).catch(error => {
                alert(error)
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateTopBar = async (topBarId: string) => {
        try {
            await updateTopBar(topBarId, form.values).then(res => {
                if (res.success) {
                    setTopBars(res.topBars)
                    setOpen(false)
                }
                alert(res.message)
            }).catch(console.log)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <li className='flex p-2.5 bg-blue-400 mt-2.5 text-white font-bold items-center justify-between'>
                <TextInput value={form.values.name} onChange={e => form.setFieldValue("name", e.target.value)} disabled={!open} className={open ? "text-black!" : "text-white bg-transparent"} />
                {open && (
                    <Group>
                        <ColorInput value={form.values.color} label="Color" placeholder='Background color of TopBar' {...form.getInputProps("color")} />
                        <TextInput value={form.values.btnText} label="Button Text" placeholder='Button Text' {...form.getInputProps("btnText")} />
                        <ColorInput value={form.values.btnColor} label="Button Color" placeholder='Button Color' {...form.getInputProps("btnColor")} />
                        <TextInput value={form.values.btnLink} label="Button Link" placeholder='Button Link' {...form.getInputProps("btnLink")} />
                        <Button onClick={() => handleUpdateTopBar(topBar._id)}>Save</Button>
                        <Button color="red" onClick={() => { setOpen(false); form.reset() }}>Cancel</Button>
                    </Group>
                )}
                {!open && (
                    <div className='flex'>
                        <AiTwotoneEdit className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => setOpen(prev => !prev)} />
                        <AiFillDelete className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => {
                            modals.openConfirmModal({
                                title: "Delete TopBar",
                                centered: true,
                                children: (<Text size="sm">Are you sure you want to delete this topBar? This action is irreversible.</Text>),
                                labels: {
                                    confirm: "Delete topBar",
                                    cancel: "No don't delete it"
                                },
                                confirmProps: { color: "red" },
                                onConfirm: () => handleRemoveTopBar(topBar._id),
                                onCancel: () => setOpen(false)
                            })
                        }} />
                    </div>
                )}
            </li>
        </div>
    )
}

export default TopBarListItem
