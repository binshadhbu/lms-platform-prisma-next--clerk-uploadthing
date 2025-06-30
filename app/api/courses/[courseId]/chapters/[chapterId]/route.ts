import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';



const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req: Request, { params }: { pramas: { courseId: string, chapterId: string } }) {
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

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        if (chapter.videoUrl) {

            // Delete Mux data if it exists
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            });

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
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

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.error("[CHAPTER_ID DELETE]", error);
        return new NextResponse("Error deleting chapter", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();
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


        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            const asset = await mux.video.assets.create({
                inputs: [{ url: values.videoUrl }],
                playback_policy: ['public'],
                video_quality: 'basic',
            });

            NextResponse.json(asset);

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.error("Error updating chapter:", error);
        return new NextResponse("Error updating chapter", { status: 500 });
    }
}