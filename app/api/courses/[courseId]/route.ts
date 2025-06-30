import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
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
            return new NextResponse("Course not found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            }
        });
        return NextResponse.json(deletedCourse);



    } catch (error) {
        console.error("[COURSE_ID DELETE]", error);
        return new NextResponse("Internal Error while deleting course", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const Values = await req.json();
        const { courseId } = params;


        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...Values
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[Course_ID]", error);
        return new Response("Internal Error in PATCH", { status: 500 });
    }
}