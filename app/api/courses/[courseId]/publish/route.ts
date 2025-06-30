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
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const hasUnpublishedChapters = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !hasUnpublishedChapters || course.categoryId) {
            if(!course.title) {
                return new NextResponse("Missing title", { status: 400 });
            }
            if(!course.description) {
                return new NextResponse("Missing description", { status: 400 });
            }
            if(!course.imageUrl) {
                return new NextResponse("Missing imageUrl", { status: 400 });
            }
            if(!hasUnpublishedChapters) {
                return new NextResponse("Course has unpublished chapters", { status: 400 });
            }
            if(!course.categoryId) {
                return new NextResponse("Missing categoryId", { status: 400 });
            }
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);


    } catch (error) {
        console.error("[COURSE_ID PATCH]", error);
        return new Response("Internal Error while publishing course", { status: 500 });
    }
}