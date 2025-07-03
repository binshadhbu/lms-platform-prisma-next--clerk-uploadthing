// import { Sidebar } from 'lucide-react'
import React from 'react'

import { auth } from '@clerk/nextjs/server'
import { isTeacher } from '@/lib/teacher'
import { redirect } from 'next/navigation'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();
    if (!isTeacher(userId)) {
        return redirect('/');
    }
    return (

        <main className='md:pl-56 pt-[80px] h-full '>{children}</main>

    )
}

export default layout
