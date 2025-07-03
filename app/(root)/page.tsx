import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashBoardCourses } from "@/actions/getDashBoardCourses";
import CourseList from "@/components/CourseList";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/infoCard";
export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const { completedCourses, courseInProgress } = await getDashBoardCourses(userId);

  return (
    <div className="p-6 space-y-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <InfoCard icon={Clock} label="In Progress" variant="default" numberOfItems={courseInProgress.length} />
        <InfoCard icon={CheckCircle} variant="success" label="Completed" numberOfItems={completedCourses.length} />
      </div>
      <CourseList items={[...courseInProgress, ...completedCourses]} />

    </div>
  );
}
