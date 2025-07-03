import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { date } from "zod";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { list } = await req.json();
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (const item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            });
        }

        return new NextResponse("success reordered", { status: 200 });

    } catch (error) {
        console.error("Error reordering chapters:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}