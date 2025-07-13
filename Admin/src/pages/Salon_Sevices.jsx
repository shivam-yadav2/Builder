import { columns } from '@/myComponent/CourseTable/columns'
import { DataTable } from '@/myComponent/CourseTable/data-table'
import React from 'react'

const Salon_Sevices = () => {
    const data = [
        {
          id: "salon-1",
          service_name: "Haircut",
          price: 500,
          category: "Hair Services",
          duration: "30 mins",
          staff: "John Doe",
        },
        {
          id: "salon-2",
          service_name: "Hair Coloring",
          price: 1500,
          category: "Hair Services",
          duration: "1 hour",
          staff: "Jane Smith",
        },
        {
          id: "salon-3",
          service_name: "Facial",
          price: 1200,
          category: "Skin Care",
          duration: "45 mins",
          staff: "Emily Johnson",
        },
        {
          id: "salon-4",
          service_name: "Manicure",
          price: 700,
          category: "Nail Services",
          duration: "30 mins",
          staff: "Michael Brown",
        },
        {
          id: "salon-5",
          service_name: "Pedicure",
          price: 900,
          category: "Nail Services",
          duration: "45 mins",
          staff: "Sarah Davis",
        },
        {
          id: "salon-6",
          service_name: "Waxing (Full Body)",
          price: 2500,
          category: "Hair Removal",
          duration: "1.5 hours",
          staff: "Laura Wilson",
        },
        {
          id: "salon-7",
          service_name: "Eyebrow Threading",
          price: 300,
          category: "Hair Removal",
          duration: "15 mins",
          staff: "Emma Thompson",
        },
        {
          id: "salon-8",
          service_name: "Makeup Application",
          price: 2000,
          category: "Makeup Services",
          duration: "1 hour",
          staff: "Sophia Martinez",
        },
        {
          id: "salon-9",
          service_name: "Bridal Makeup",
          price: 5000,
          category: "Makeup Services",
          duration: "2 hours",
          staff: "Olivia Anderson",
        },
        {
          id: "salon-10",
          service_name: "Massage Therapy",
          price: 3000,
          category: "Body Spa",
          duration: "1.5 hours",
          staff: "David Miller",
        }
      ];
      
    return (

        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>

    )
}

export default Salon_Sevices