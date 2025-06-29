"use client";
import { FileUpload } from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Chapter,  MuxData } from '@/lib/generated/prisma';
import axios from 'axios';
import {  Pencil, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import MuxPlayer from "@mux/mux-player-react";
import * as z from 'zod'

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const ChapterVideo = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    }

   

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Video URL updated successfully!");
            toggleEdit();
            console.log(values.videoUrl);
            router.refresh();
        } catch (error) {
            console.error("Error updating course description:", error);
            toast.error("Error updating course description:");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Video
                <Button onClick={toggleEdit} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2' >
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='chapterVideo' onChange={(url) => {
                        if (url) {
                            onSubmit({ videoUrl: url });
                        }
                    }} />
                    <div className='text-xs text-muted-foreground mt-4'>Upload this chapters video</div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-2'>Videos can take a few minutes to process, please check back later.</div>
            )}
        </div>
    )
}

export default ChapterVideo
