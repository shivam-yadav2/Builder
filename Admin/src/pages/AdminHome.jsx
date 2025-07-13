import React from 'react'
import Layout from '../layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Building, Mountain, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
const AdminHome = () => {
  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Admin</h1>
          <p className="text-sm text-gray-500">Manage listings for Samadhan Groups</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Home className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-lg font-semibold">24 Homes</p>
                <p className="text-sm text-gray-500">Active Listings</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Building className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-lg font-semibold">15 Properties</p>
                <p className="text-sm text-gray-500">Residential & Commercial</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Mountain className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-lg font-semibold">9 Lands</p>
                <p className="text-sm text-gray-500">Available for Sale</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Listing Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
         <Link  to="/addhome" >
          <Button className="flex  cursor-pointer items-center gap-2 text-white">
            <Home className="w-4 h-4" />
            Add Home
          </Button>
          </Link>
         <Link to="/addland" >
          <Button className="flex cursor-pointer items-center gap-2 text-white">
            <Mountain className="w-4 h-4" />
            Add Land
          </Button>
          </Link>
          <Link to="/allproperty" >
          <Button className="flex cursor-pointer  items-center gap-2 text-white">
            <Building className="w-4 h-4" />
            All Property
          </Button>
          </Link>
        </div>

        {/* Manage Listings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Listings</h2>
          <div className="border rounded-lg p-4 text-gray-500">
            No listings available. Click one of the buttons above to get started.
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminHome
