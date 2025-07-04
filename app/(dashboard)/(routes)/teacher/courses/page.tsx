
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/dataTable'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'




const page = async () => {
  const {userId}= await auth();
  if(!userId) {
    redirect('/');
  }

  const courses= await db.course.findMany({
    where:{
      userId,
    },
    orderBy:{
      createdAt: 'desc',
    }
  });
  

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />

    </div>
  )
}

export default page
