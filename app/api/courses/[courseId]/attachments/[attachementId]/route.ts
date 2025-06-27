import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{courseId:string,attachmentId:string}}) {
    try {
        const { userId } = await auth();
        if (!userId){
            // console.error("[COURSE_ID_ATTACHMENTS]", "Unauthorized user");
            return new NextResponse("Unauthorized user", { status: 401 });
        }
        console.log("[COURSE_ID_ATTACHMENTS]", "Deleting attachment", params.attachmentId, "from course", params.courseId);

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const attachment = await db.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}