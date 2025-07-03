import { db } from "@/lib/db";
import { Course, Purchase } from "@/lib/generated/prisma";
import { object } from "zod";

type PurchaseWithCourse = Purchase & {
    course: Course;
};
const groupBycourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};
    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price!;
    });
    return grouped;
};

export async function getAnalytics(userId: string) {
    try {
        const purchases = await db.purchase.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true,
            }
        });
        const groupedEarnings = groupBycourse(purchases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, totalEarnings]) => ({
            name: courseTitle,
            totalEarnings: totalEarnings,
        }));
        const totalRevenue = data.reduce((acc, item) => acc + item.totalEarnings, 0);
        const totalSales = purchases.length;
        return { data, totalRevenue, totalSales };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { data: [], totalRevenue: 0, totalSales: 0 };
    }

}