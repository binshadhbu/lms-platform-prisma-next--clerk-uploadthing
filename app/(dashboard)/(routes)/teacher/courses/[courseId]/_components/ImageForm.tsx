"use client";
import { FileUpload } from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/lib/generated/prisma';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { init } from 'next/dist/compiled/webpack/webpack';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod'
import { ca } from 'zod/v4/locales';


interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: 'Image is required' }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || '',
        }
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course description updated successfully!");
            toggleEdit();
            console.log(values.imageUrl);
            router.refresh();
        } catch(error) {
            console.error("Error updating course description:", error);
            toast.error("Error updating course description:");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Image
                <Button onClick={toggleEdit} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2' >
                        <Image alt='upload' fill className='object-cover rounded-md' src={initialData.imageUrl} />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='courseImage' onChange={(url) => {
                        if (url) {
                            onSubmit({ imageUrl: url });
                        }
                    }} />
                    <div className='text-xs text-muted-foreground mt-4'>16:9 aspect ratio recommended</div>
                </div>
            )}
        </div>
    )
}

export default ImageForm
