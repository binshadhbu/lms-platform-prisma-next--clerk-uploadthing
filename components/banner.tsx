import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';
import React from 'react'

const bannerVariants = cva(
    "border text-center p-4 text-sm items-center w-full ",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80  text-primary border-yellow-30",
                success: "bg-emerald-700 border-emerald text-secondary"
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
};

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

const Banner = ({ label, variant }: BannerProps) => {
    const Icon = iconMap[variant || "warning"];

    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className='h-4 w-4 mr-2' />
            {label}

        </div>
    )
};

export default Banner
