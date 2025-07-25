"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { Course } from '@/lib/generated/prisma';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod'


interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData.price || undefined,
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course price updated successfully!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error updating course price:");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course price
                <Button onClick={toggleEdit} variant={'ghost'} className='hover:cursor-pointer  bg-blue-900 text-white '>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn('text-sm mt-2', !initialData.price && 'text-slate-500 italic')}>{initialData.price ? initialData.price : "No Price"}</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='price' render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} step="0.01" placeholder='e.g. 29.99' type='number' {...field} />
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

export default PriceForm
