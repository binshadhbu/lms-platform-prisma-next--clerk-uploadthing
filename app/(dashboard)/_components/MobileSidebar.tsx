import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'
import SideBar from './SideBar'

const MobileSidebar = () => {
    return (
        <div>
            <Sheet>
                <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
                    <Menu />
                </SheetTrigger>
                <SheetContent side='left' className='p-0 bg-white'>
                    <SideBar />
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileSidebar
