/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IconBadge } from '@/components/iconBadge';
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm ';
import AttachemntForm from './_components/AttachemntForm';
import ChapterForm from './_components/ChapterForm';
import { isUploadable } from '@mux/mux-node/uploads.mjs';
import Banner from '@/components/banner';
import Actions from './_components/Actions';

const page = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = await auth();
    if (!userId) {
        return redirect(`/`);
    }
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: 'asc',
                }
            },
            attachments: {
                orderBy: {
                    createdAt: 'desc',
                }
            }
        }
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc',
        }
    });


    if (!course) {
        return redirect(`/`);
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);


    return (
        <>
        {!course.isPublished && (
            <Banner
                label='Your course is not published yet'
            />
        )}
        <div className='p-6 '>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>Course setup</h1>
                    <span className='text-sm text-slate-700'>Complete all fields {completionText}</span>
                </div>
                {/* add actions */}
                <Actions disabled={!isComplete} courseId={course.id}  isPublished={course.isPublished} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div >
                    <div className='flex items-center gap-x-2'>
                        {/* @ts-expect-error */}
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl'>Customize your course</h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                    }))} />
                </div>
                <div className='space-y-6 '>
                    <div className=''>
                        <div className='flex items-center gap-x-2'>
                            {/* @ts-expect-error */}
                            <IconBadge icon={ListChecks} />
                            <h2 className='text-xl'>Course Chapters</h2>
                        </div>
                        <ChapterForm initialData={course} courseId={course.id} />
                    </div>
                    <div className='flex items-center gap-x-2'>
                        {/* @ts-expect-error */}
                        <IconBadge icon={CircleDollarSign} />
                        <h2 className='text-xl'>Sell your Course</h2>
                    </div>
                    <PriceForm initialData={course} courseId={course.id} />

                    <div className='flex items-center gap-x-2'>
                        {/* @ts-expect-error */}
                        <IconBadge icon={File} />
                        <h2 className='text-xl'>Resources & Attachments</h2>
                    </div>
                    <AttachemntForm initialData={course} courseId={course.id} />
                </div>
            </div>
        </div>
        </>
    )
}

export default page
