"use client";
import React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
})

const Page = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',

        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Course created successfully!");

        } catch {
            // console.error("Error submitting form:", error);
            toast.error("Failed to create course. Please try again.");
        }
    }

    return (
        <div className='max-w-2-5xl mx-auto md:items-center md:justify-center h-full p-6 '>
            <div>
                <h1 className='text-2xl'>Name your course</h1>
                <p className='text-sm text-slate-600' >what would you like to name your course?</p>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onsubmit)} className='space-y-8 mt-8'>
                        <FormField control={form.control} name='title' render={({ field }) => (
                            <FormItem>
                                <FormLabel >Course title</FormLabel>
                                <FormControl><input {...field} disabled={isSubmitting} placeholder='e.g.advanced web development' className='outline rounded-2xl' /></FormControl>
                                <FormDescription>what will you teach in this course?</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className='flex items-center gap-x-2'>
                            <Link href={'/'}>
                                <Button variant={"ghost"} type='button'>Cancel</Button>
                            </Link>
                            <Button type='submit' disabled={!isValid || isSubmitting}>Continue</Button>

                        </div>

                    </form>

                </Form>
            </div>
        </div>
    )
}

export default Page
