import { db } from "@/lib/db";
import { Category, Course } from "@/lib/generated/prisma"
import { create } from "domain";
import getProgress from "./getProgress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const GetCourses = async ({ userId, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                    mode: "insensitive"
                },
                categoryId: categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                Purchase: {
                    where: {
                        userId: userId
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.Purchase.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);
                return {
                    ...course,
                    progress: progressPercentage
                };
            })
        );

        return courseWithProgress;

    } catch (error) {
        console.error("[GET_COURSES] Error fetching courses:", error);
        return [];
    }
}