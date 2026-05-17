import { handleVerificationChange } from '@/lib/database/actions/admin/products/products.actions'
import { Switch } from '@mantine/core'

function SwitchComponent({ verified, _id }: { verified: boolean, _id: string }) {
    return (
        <div>
            <Switch label="verified" checked={verified} onChange={async (e) => await handleVerificationChange(_id, e.target.value).then(res => {
                alert(res.message)
            }).catch(console.log)} />
        </div>
    )
}

export default SwitchComponent
