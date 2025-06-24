"use client";
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SideBarItemProps {
    icon: LucideIcon;
    path: string;
    label: string;
}

const SideBarItem = ({ icon: Icon, path, label }: SideBarItemProps) => {

    const router = useRouter();
    const pathname = usePathname();

    const isActive = (pathname === '/' && path === '/') || pathname === path || pathname?.startsWith(`${path}/`);

    const onClick = () => {
        router.push(path);

    }

    return (
        <button onClick={onClick} type='button' className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-700/20 hover:text-sky-700")}  >
            <div className='flex items-center gap-x-2 py-4'>
                <Icon size={22} className={cn("text-slate-500",isActive && "text-sky-700")}/>
                <span>{label}</span>

            </div>
            <div className={cn("ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",isActive && "opacity-100")} ></div>
        </button>
    )
}

export default SideBarItem
