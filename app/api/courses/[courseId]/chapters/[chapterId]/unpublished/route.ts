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

        const unpulishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: false
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unpulishedChapter);

    } catch (error) {
        console.error("[CHAPTER_ID PATCH]", error);
        return new NextResponse("Internal Error while unpublishing", { status: 500 });
    }
}