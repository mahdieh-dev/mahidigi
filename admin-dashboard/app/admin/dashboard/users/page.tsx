import UsersTable from '@/components/admin/dashboard/users/table'
import { getAllUsers } from '@/lib/database/actions/admin/user.actions'
import React, { useEffect, useState } from 'react'

function AllUsersPage() {
    const [users, setUsers] = useState()

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                await getAllUsers().then(res => {
                    setUsers(res)
                }).catch(console.log)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllUsers()
    }, [])

    return (
        <div className='container'>
            <UsersTable rows={users} />
        </div>
    )
}

export default AllUsersPage
