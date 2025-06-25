import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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