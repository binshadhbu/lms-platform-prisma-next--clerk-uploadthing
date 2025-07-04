"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod'


interface ChapterTitleFormProps {
    initialData: {
        title: string
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            // console.log(values);
            toast.success("Chapter title updated successfully!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error updating chapter title:");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Title
                <Button onClick={toggleEdit} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm text-muted-foreground mt-2'>{initialData.title}</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='title' render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder='e.g Introduction to React' {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>Save</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterTitleForm
