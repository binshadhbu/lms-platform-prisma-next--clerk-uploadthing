/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IconBadge } from '@/components/iconBadge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import ChapterTitleForm from '../_components/ChapterTitleForm';
import ChapterDescriptionForm from '../_components/ChapterDescriptionForm';
import ChapterAccessForm from '../_components/ChapterAccessForm ';
import ChapterVideo from '../_components/ChapterVideoForm';
import Banner from '@/components/banner';
import ChapterActions from '../_components/ChapterActions';

const ChapterPage = async ({ params }: { params: { courseId: string, chapterId: string } }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true
    }
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} of ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner variant="warning" label="This chapter is not published yet." />
      )}
      <div className='p-6 '>
        <div className='flex items-center justify-between '>
          <div className='w-full'>
            <Link href={`/teacher/courses/${params.courseId}`} className='flex items-center text-sm font-semibold hover:opacity-75 transition mb-6'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to course setup
            </Link>
            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-2xl font-medium'>Chapter Creation</h1>
                <span className='text-sm text-slate-700'>Complete all fields {completionText}</span>
              </div>

              <ChapterActions disabled={!isComplete}  courseId={params.courseId} chapterId={params.chapterId} isPublished={chapter.isPublished} />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 '>
          <div className='space-y-4 '>
            <div className='flex items-center gap-x-2 '>
              {/* @ts-expect-error */}
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize your chapter</h2>
            </div>

            <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
          <div className='space-y-4' >
            <div className='flex items-center gap-x-2'>
              {/* @ts-expect-error */}
              <IconBadge icon={Eye} />
              <h2 className='text-xl'>Access Settings</h2>
            </div>
            <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>


          <div>
            <div className='flex items-center gap-x-2'>
              {/* @ts-expect-error */}
              <IconBadge icon={Video} />
              <h2 className='text-xl'>Video Settings</h2>
            </div>
            <ChapterVideo initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>

        </div>
      </div>
    </>

  )
}

export default ChapterPage

