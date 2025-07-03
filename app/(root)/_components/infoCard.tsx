/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IconBadge } from '@/components/iconBadge'
import React from 'react'

interface infoCardProps {
    icon: React.ElementType;
    label: string;
    numberOfItems: number;
    variant?: 'default' | 'success';
}

const InfoCard = ({ icon: Icon, label, numberOfItems, variant }: infoCardProps) => {
    return (
        <div className='border rounded-md flex items-center gap-x-2 p-3'>
            {/* @ts-expect-error */}
            <IconBadge variant={variant} icon={Icon} label={label} />
            <div>
                <p className='font-medium '>
                    {label}
                </p>
                <p className='text-gray-500 text-sm'>{numberOfItems}{numberOfItems === 1 ? ' course' : ' courses'}</p>
            </div>
        </div>
    )
}

export default InfoCard
