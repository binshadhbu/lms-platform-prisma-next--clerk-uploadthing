"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Chapter, Course } from '@/lib/generated/prisma';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Pencil, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod'
import { ca } from 'zod/v4/locales';
import ChapterList from './ChapterList';


interface CourseFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

const ChapterForm = ({ initialData, courseId }: CourseFormProps) => {
    const [isCreating, setIsCreating] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const router = useRouter();

    const toggleCreating = () => {
        setIsCreating((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Course Chapter created successfully!");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Error updating course Chapter:");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Chapters
                <Button onClick={toggleCreating} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isCreating && (
                        <>Cancel</>
                    )}
                    {!isCreating && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a Chapter
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='title' render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder='Chapter Title' {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button disabled={!isValid || isSubmitting} type='submit'>Create</Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
                    {!initialData.chapters.length && "No chapters added yet."}
                    {/* todo add a list )} */}
                    <ChapterList onEdit={()=>{}} onReorder={()=>{}} items={initialData.chapters || []} />
                </div>
            )}
            {!isCreating && (
                <p className='text-xs text-muted-foreground mt-4'>
                    Drag and Drop to reorder
                </p>
            )}
        </div>
    )
}

export default ChapterForm
