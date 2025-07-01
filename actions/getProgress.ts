import { db } from '@/lib/db';

const getProgress = async (userId: string, courseID: string): Promise<number> => {
    try {
        const publishedChapter = await db.chapter.findMany({
            where: {
                courseId: courseID,
                isPublished: true
            },
            select: {
                id: true
            }
        });

        const publishedChapterIds = publishedChapter.map((chapter)=> chapter.id);
        const validCompletedChapters = await db.userProgress.count({
            where:{
                userId: userId,
                chapterId: {
                    in: publishedChapterIds
                },
                isCompleted: true
            }
        });

        const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;
        return Math.round(progressPercentage);
    } catch (error) {
        console.error("[GET_PROGRESS]Error fetching progress:", error);
        return 0; // Return 0 or handle the error as needed
    }
}

export default getProgress
