import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = await auth();
    if (!userId) {
        return redirect(`/`);
    }
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
    });

    if (!course) {
        return redirect(`/`);
    }

    return (
        <div>
            course id {params.courseId}
        </div>
    )
}

export default page
