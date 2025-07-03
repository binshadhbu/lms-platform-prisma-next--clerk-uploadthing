import { getChapter } from '@/actions/getChapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from '../../_components/VideoPlayer';
import CourseEnrollButton from '../../_components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import Preview from '@/components/preview';
import { File } from 'lucide-react';
import CourseProgress from '@/components/CourseProgress';
import CourseProgressButton from '../../_components/CourseProgressButton';

const page = async ({ params }: { params: { chapterId: string, courseId: string } }) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/');
    }
    const { chapter, course, muxData, attachements, nextChapter, userProgress, purchase } = await getChapter({ userId, chapterId: params.chapterId, courseId: params.courseId });
    if (!chapter || !course) {
        return redirect('/');
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && userProgress?.isCompleted;


    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner label='you already completed this chapter' variant='success' />
            )}
            {isLocked && (
                <Banner label='this chapter is locked,you have to purchase ' variant='warning' />
            )}
            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    <VideoPlayer chapterId={params.chapterId} courseId={params.courseId} title={chapter.title} nextChapterId={nextChapter?.id}
                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                        playbackId={muxData?.playbackId!} isLocked={isLocked} completeOnEnd={completeOnEnd!} />
                </div>
                <div>
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
                        {purchase ? (
                            <CourseProgressButton chapterId={params.chapterId} courseId={params.courseId}
                                nextChapterId={nextChapter?.id} isCompleted={!!userProgress?.isCompleted} />
                        ) : (
                            <CourseEnrollButton courseId={params.courseId} price={course.price!} />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachements.length && (
                        <>
                            <Separator />
                            <div className='p-4 '>
                                {
                                    attachements.map((attachement) => (
                                        <a href={attachement.url} key={attachement.id} target='_blank' className='flex items-center p-3 w-full bg-sky-200 boder text-sky-700 rounded-md hover:underline'>
                                            <File />
                                            <p className='line-clamp-1'>{attachement.name}</p>
                                        </a>
                                    ))
                                }

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page
