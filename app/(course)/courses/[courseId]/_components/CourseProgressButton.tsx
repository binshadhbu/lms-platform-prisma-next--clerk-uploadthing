"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { set } from 'zod';

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
};

const CourseProgressButton = ({ chapterId, courseId, nextChapterId, isCompleted }: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,

            });

            if (!isCompleted && !nextChapterId) {
                toast.success('course completed');
            }
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
            toast.success("progress updated successfully");
            router.refresh();

        } catch {
            toast.error('Something went wrong, please try again later');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} className='w-full md:w-auto' type='button' variant={isCompleted ? 'outline' : 'success'} >
            {isCompleted ? 'Not completed' : 'Mark as complete'}
            <Icon className='h-4 w-4 ml-2' />
        </Button>
    )
}

export default CourseProgressButton
