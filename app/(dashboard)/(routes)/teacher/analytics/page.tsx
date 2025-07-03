import { getAnalytics } from '@/actions/getAnalytics';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import DataCard from '../_components/DataCard';
import Chart from '../_components/Chart';

const page = async () => {
  const {userId}= await auth();
  // const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  if(!userId) {
    return redirect('/');
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <DataCard label="Total Revenue" value={totalRevenue} shouldFormat={true} />
           <DataCard label="Total Sales" value={totalSales} shouldFormat={false} />
        </div>
        <Chart data={data.map(item => ({
          name: item.name,
          total: item.totalEarnings
        }))}/>
    </div>
  )
}

export default page

