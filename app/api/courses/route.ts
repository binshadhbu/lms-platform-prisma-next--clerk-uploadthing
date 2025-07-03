import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { use } from "react";

export async function POST(req: Request,) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();


        if (!userId || !isTeacher(userId)) {
            console.log("Creating course for user:", userId);
            return new NextResponse("Unauthorized prisma", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                title,
                userId,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[Courses]", error)
        return new Response("internal Error in POST", { status: 500 });
    }
}