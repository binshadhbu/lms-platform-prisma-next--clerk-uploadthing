import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseId = await params.courseId;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!course) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unpublishedCourse);


    } catch (error) {
        console.error("[COURSE_ID PATCH]", error);
        return new Response("Internal Error while unpublishing course", { status: 500 });
    }
}