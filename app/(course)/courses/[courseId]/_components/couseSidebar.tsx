import { db } from '@/lib/db';
import { Chapter, Course, UserProgress } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import CourseSideBarItem from './CourseSideBarItem';
import CourseProgress from '@/components/CourseProgress';

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    };
    progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/');
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });


    return (
        <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
            <div className='p-8 flex flex-col border-b'>
                <h1 className='font-semibold'>{course.title}</h1>
                {/* check purchase and progress */}
                {purchase && (
                    <div className='mt-10'>
                        <CourseProgress value={progressCount} variant="success" />
                    </div>
                )}
            </div>

            <div className='flex flex-col w-full'>
                {course.chapters.map((chapter) => (
                    <CourseSideBarItem key={chapter.id} id={chapter.id} label={chapter.title} isCompleted={!!chapter.userProgress?.[0]?.isCompleted} courseId={course.id}
                        isLocked={!chapter.isFree && !purchase} />
                ))}
            </div>

        </div>
    )
}

export default CourseSidebar
