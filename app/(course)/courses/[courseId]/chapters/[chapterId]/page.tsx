import { getChapter } from '@/actions/getChapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from '../../_components/VideoPlayer';

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
            <Banner label='you already completed this chapter' variant='success'/>
           )}
           {isLocked && (
            <Banner label='this chapter is locked,you have to purchase ' variant='warning'/>
           )}
           <div className='flex flex-col max-w-4xl mx-auto pb-20'>
            <div className='p-4'>
                <VideoPlayer chapterId={params.chapterId} courseId={params.courseId} title={chapter.title} nextChapterId={nextChapter?.id}
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                playbackId={muxData?.playbackId!} isLocked={isLocked} completeOnEnd={completeOnEnd!}/>
            </div>

           </div>
        </div>
    )
}

export default page
