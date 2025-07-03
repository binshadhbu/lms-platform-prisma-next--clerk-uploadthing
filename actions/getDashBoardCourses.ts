import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@/lib/generated/prisma";
import getProgress from "./getProgress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashBoardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

export const getDashBoardCourses = async (userId: string): Promise<DashBoardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course['progress'] = progress;

        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return { completedCourses, courseInProgress };
    } catch (error) {
        console.error('Error fetching dashboard courses:', error);
        return {
            completedCourses: [],
            courseInProgress: []
        };
    }

}