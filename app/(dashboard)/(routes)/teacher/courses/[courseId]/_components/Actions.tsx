"use client";
import ConfirmModal from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    
    isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted successfully!");
            router.refresh();
            router.push(`/teacher/courses`);
            setLoading(false);
        } catch {
            toast.error("Something went wrong while deleting the course.");
        } finally {
            setLoading(false);
        }
    }

    const onClick= async()=>{
        try{
            setLoading(true);

            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished successfully!");
            }else{
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published successfully!");
            }
            router.refresh();
        }catch{
            toast.error("Something went wrong ");
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center gap-x-2'>
            <Button onClick={onClick} disabled={disabled || isLoading} variant={'outline'} className='bg-blue-900 text-white hover:bg-slate-400'>
                {isPublished ? "Unpublish Course" : "Publish Course"}
            </Button>
            <ConfirmModal onConfirm={onDelete} >
                <Button size='sm' className='' disabled={isLoading}>
                    <Trash />
                </Button>
            </ConfirmModal>
        </div>

    )
}

export default Actions
