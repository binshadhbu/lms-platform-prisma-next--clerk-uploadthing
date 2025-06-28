import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        const values = await req.json();
        console.log("Updating chapter with title:", values);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseId = params.courseId;
        const chapterId = params.chapterId;

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        console.error("Error updating chapter:", error);
        return new NextResponse("Error updating chapter", { status: 500 });
    }
}