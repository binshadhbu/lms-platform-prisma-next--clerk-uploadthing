/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { FileUpload } from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@/lib/generated/prisma';
import axios from 'axios';
import { Cross, File, Loader2, PlusCircle, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import * as z from 'zod'

interface AttachemntFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});

const AttachemntForm = ({ initialData, courseId }: AttachemntFormProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course attachment added successfully!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.error("Error updating course description:", error);
            toast.error("Error updating course description:");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted successfully!");
            router.refresh();

        } catch (error) {
            console.error("Error deleting attachment:", error);
            toast.error("Error deleting attachment");
        } finally {
            setDeletingId(null);
        }
    }
    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Attachements
                <Button onClick={toggleEdit} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a file
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm text-slate-500 italic mt-2'>No Attachments yet</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {
                                initialData.attachments.map((attachment) => (
                                    <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border  text-sky-700 rounded-md'>
                                        <File className='h-4 w-4 me-2 flex-shrink-0' />
                                        <p className='text-sm line-clamp-1'>{attachment.name}</p>
                                        {deletingId === attachment.id && (
                                            <div>
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                            </div>
                                        )}

                                        {deletingId !== attachment.id && (
                                            <button onClick={() => onDelete(attachment.id)} className='ml-auto hover:opacity-75 transition hover:cursor-pointer pl-5'>
                                                <Trash className='h-4 w-4 ' />
                                            </button>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='courseAttachement' onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url });
                        }
                    }} />
                    <div className='text-xs text-muted-foreground mt-4'>Add any documents related to the course</div>
                </div>
            )}
        </div>
    )
}

export default AttachemntForm
