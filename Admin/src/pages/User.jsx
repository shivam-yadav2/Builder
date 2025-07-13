import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import axios from 'axios'
import { Card } from '@/components/ui/card'

const User = () => {

  const mockUsers = [
    {
      _id: '1',
      avatar: 'https://i.pravatar.cc/100?img=1',
      name: 'Shivanshu Rastogi',
      phone: '9876543210',
      email: 'shivanshu@example.com',
      location: 'Lucknow',
      purpose: 'Both',
      aadhaar_number: '1234-5678-9012',
      createdAt: '2024-05-10T10:30:00Z',
    },
    {
      _id: '2',
      avatar: 'https://i.pravatar.cc/100?img=2',
      name: 'Priya Sharma',
      phone: '9988776655',
      email: 'priya@example.com',
      location: 'Delhi',
      purpose: 'House',
      aadhaar_number: '4321-8765-2109',
      createdAt: '2024-06-15T14:00:00Z',
    },
    {
      _id: '3',
      avatar: 'https://i.pravatar.cc/100?img=3',
      name: 'Rahul Mehta',
      phone: '9123456780',
      email: 'rahul@example.com',
      location: 'Mumbai',
      purpose: 'Land',
      aadhaar_number: '9876-5432-1098',
      createdAt: '2024-07-01T08:45:00Z',
    },
  ]
  

  const [users, setUsers] = useState([])

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const res = await axios.get('/api/users') // Adjust the route as per your backend
    //     setUsers(res.data.users)
    //   } catch (err) {
    //     console.error('Error fetching users:', err)
    //   }
    // }
    setTimeout(() => {
      setUsers(mockUsers)
    }, 500)

    // fetchUsers()
  }, [])

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>

        <Card className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Avatar</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Aadhaar</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id} className="text-sm text-center">
                    <td className="border px-2 py-1">
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    </td>
                    <td className="border px-2 py-1">{user.name}</td>
                    <td className="border px-2 py-1">{user.phone}</td>
                    <td className="border px-2 py-1">{user.email}</td>
                    <td className="border px-2 py-1">{user.location || '-'}</td>
                    <td className="border px-2 py-1">{user.purpose}</td>
                    <td className="border px-2 py-1">{user.aadhaar_number}</td>
                    <td className="border px-2 py-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}

export default User
