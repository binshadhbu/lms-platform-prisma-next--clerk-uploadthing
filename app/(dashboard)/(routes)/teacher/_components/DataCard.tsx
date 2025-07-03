import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'

interface DataCardProps {
    value:number;
    label:string;
    shouldFormat?:boolean;
};


const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {

  return (
    <div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{label}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className='text-2xl font-bold '>
                {shouldFormat?  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', }).format(value) : value}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataCard
