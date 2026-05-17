import { deleteOffer, updateOffer } from '@/lib/database/actions/admin/offers/offers.action'
import { Button, Group, Select, Text, TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useRouter } from 'next/navigation'
import React, { SetStateAction, useRef, useState } from 'react'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'

function OfferListItem({ offer, setOffers }: { offer: any, setOffers: React.Dispatch<SetStateAction<any>> }) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(offer.title)
    const [offerType, setOfferType] = useState(offer.offerType)
    const input = useRef<any>(null)
    const router = useRouter()

    const handleRemoveOffer = async (offerId: string) => {
        try {
            await deleteOffer(offerId).then(res => {
                if (res.success) {
                    setOffers(res.offers)
                }
                alert(res.message)
            }).catch(console.log)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateOffer = async (offerId: string) => {
        try {
            await updateOffer(offerId, { title, offerType }).then(res => {
                if (res.success) {
                    setOffers(res.offers)
                    router.refresh()
                }
                alert(res.message)
                setOpen(false)
            }).catch(console.log)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <li className='flex p-2.5 bg-blue-400 mt-2.5 text-white font-bold items-center justify-between'>
                <div className='flex'>
                    <TextInput value={title} onChange={e => setTitle(e.target.value)} disabled={!open} ref={input} className={open ? "bg-white text-black!" : " text-white bg-transparent"} />
                    <Select value={offerType} onChange={setOfferType} data={[
                        { value: "specialCombo", label: "Special Combo" },
                        { value: "crazyDeal", label: "Crazy Deal" },
                    ]} disabled={!open} className='ml-4' />
                </div>
                {open && (
                    <Group>
                        <Button onClick={() => handleUpdateOffer(offer._id)}>Save</Button>
                        <Button color="red" onClick={() => { setTitle(offer.title); setOfferType(offer.offerType); setOpen(false); }}>Cancel</Button>
                    </Group>
                )}
                {!open && (
                    <div className='flex'>
                        <AiTwotoneEdit className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => { setOpen(prev => !prev); input?.current?.focus() }} />
                        <AiFillDelete className='w-5.5 h-5.5 cursor-pointer ml-4' onClick={() => {
                            modals.openConfirmModal({
                                title: "Delete Offer",
                                centered: true,
                                children: (<Text size='sm'>Are you sure you want to delete this offer? This action is irreversible.</Text>),
                                labels: {
                                    confirm: "Yes, I'm sure",
                                    cancel: "No, cancel"
                                },
                                confirmProps: { color: "red" },
                                onCancel: () => console.log("Cancel"),
                                onConfirm: () => handleRemoveOffer(offer._id)
                            })
                        }} />
                    </div>
                )}
            </li>
        </div>
    )
}

export default OfferListItem
