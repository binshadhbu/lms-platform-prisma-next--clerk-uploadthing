"use client";

import { Compass, Layout } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'
import SideBarItem from './SideBarItem';

const routes = [
    {icon:Layout,label:"Dashboard",path:"/"},
    {icon:Compass,label:"Browse",path:"/search"},
    
]

const SidebarRoutes = () => {
    

  return (
    <div className='flex flex-col w-full'>
      {routes.map((route) => (
        <SideBarItem
          key={route.path}
          icon={route.icon}
          path={route.path}
          label={route.label}
        />
      ))}
    </div>
  )
}

export default SidebarRoutes
