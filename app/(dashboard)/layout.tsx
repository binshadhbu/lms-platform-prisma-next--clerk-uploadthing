// import { Sidebar } from 'lucide-react'
import React from 'react'
import SideBar from './_components/SideBar'
import Navbar from './_components/Navbar'
import { auth } from '@clerk/nextjs/server'
import { isTeacher } from '@/lib/teacher'
import { redirect } from 'next/navigation'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const {userId}= await auth();
  if(!isTeacher(userId)) {
    return redirect('/');
  }
  return (
    <div className='h-full '>
      <div className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
        <Navbar/>
      </div>
      <div className='hidden md:flex w-56 flex-col fixed inset-y-0 z-50'>
        <SideBar />
      </div>
      <main className='md:pl-56 pt-[80px] h-full '>{children}</main>
    </div>
  )
}

export default layout
