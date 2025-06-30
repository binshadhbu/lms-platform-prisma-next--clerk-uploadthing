"use client";
import ConfirmModal from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { set } from 'zod';

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted successfully!");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
            setLoading(false);
        } catch {
            toast.error("Something went wrong while deleting the chapter.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center gap-x-2'>
            <Button onClick={() => { }} disabled={disabled || isLoading} variant={'outline'} className='bg-blue-900 text-white hover:bg-slate-400'>
                {isPublished ? "Unpublish Chapter" : "Publish Chapter"}
            </Button>
            <ConfirmModal onConfirm={onDelete} >
                <Button size='sm' className='' disabled={isLoading}>
                    <Trash />
                </Button>
            </ConfirmModal>
        </div>

    )
}

export default ChapterActions
