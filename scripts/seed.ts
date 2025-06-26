import { PrismaClient } from "@/lib/generated/prisma";
import { ca } from "zod/v4/locales";

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Web Development" },
                { name: "Mobile Development" },
                { name: "Data Science" },
                { name: "Machine Learning" },
                { name: "Cloud Computing" },
                { name: "Cybersecurity" },
                { name: "Game Development" },
                { name: "DevOps" },
                { name: "Blockchain" },
                { name: "Artificial Intelligence" },
                { name: "Internet of Things" },
                { name: "Software Engineering" },
                { name: "UI/UX Design" },
                { name: "Digital Marketing" },
                { name: "Project Management" },
                { name: "Agile Methodologies" },
                { name: "Business Analysis" },
                { name: "Quality Assurance" },
                { name: "Technical Writing" },
                { name: "IT Support and Administration" }
            ]
        });
        console.log("Database categories seeded successfully.");


    } catch (error) {
        console.error("Error seeding the database categories:", error);
    } finally {
        await database.$disconnect();
    }
}

main();