"use client";
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import qs from 'query-string';
import { ca } from 'zod/v4/locales';

const CategoryItem = ({ label, icon: Icon, value }: { label: string; icon: React.ElementType; value: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipNull: true, skipEmptyString: true });
    router.push(url);
  }

  return (
    <button onClick={onClick} className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:order-sky-700 transition", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800 ")} type="button">
      {Icon && <Icon size={20} />}
      <div className='truncate'>{label}</div>
    </button>
  )
}

export default CategoryItem
