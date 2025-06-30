import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseId = await params.courseId;
        const chapterId = await params.chapterId;

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("missing required fields", { status: 400 });
        }

        const pulishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(pulishedChapter);

    } catch (error) {
        console.error("[CHAPTER_ID PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}