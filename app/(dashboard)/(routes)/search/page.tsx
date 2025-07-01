import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/Categories';
import SearchInput from '@/components/SearchInput';
import { GetCourses } from '@/actions/getCourses';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const page = async ({ searchParams }: SearchPageProps) => {

  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await GetCourses({ userId, ...searchParams })

  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6 '>
        <Categories items={categories} />

      </div>
    </>
  )
}

export default page
