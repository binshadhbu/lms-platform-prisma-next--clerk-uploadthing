
"use client";
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { title } from 'process';

const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get('categoryId');

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue,
            }
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    }, [debouncedValue, currentCategoryId, pathname, router]);

    return (
        <div className='relative '>
            <SearchIcon className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
            <Input value={value} onChange={(e) => setValue(e.target.value)} className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200' placeholder='search for a course' />
        </div>
    )
}

export default SearchInput
