import React from 'react'
import { Category, Course } from "@/lib/generated/prisma"
import CourseCard from './CourseCard';


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CourseListProps {
    items: CourseWithProgressWithCategory[];
}

const CourseList = ({ items }: CourseListProps) => {
    return (
        <div>
            <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4  gap-4'>
                {items.map((item) => (
                    <CourseCard key={item.id}  id={item.id} title={item.title}
                        imageUrl={item.imageUrl!} chaptersLength={item.chapters.length} price={item.price!}
                        progress={item.progress} category={item?.category?.name} />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground">
                    No courses found.
                </div>
            )}
        </div>
    )
}

export default CourseList
