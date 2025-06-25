"use client";

import { BarChart, Compass, Layout, List } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'
import SideBarItem from './SideBarItem';

const guestroutes = [
  { icon: Layout, label: "Dashboard", path: "/" },
  { icon: Compass, label: "Browse", path: "/search" },

]

const teacherRoutes = [
  { icon: List, label: "Courses", path: "/teacher/courses" },
  { icon: BarChart, label: "Analytics", path: "/teacher/analytics" },

]

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestroutes;


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
