"use client";
import { Category } from '@/lib/generated/prisma';
import { validateHeaderName } from 'http';
import React from 'react'
import { FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from "react-icons/fc";
import { IconType } from 'react-icons/lib';
import CategoryItem from './CategoryItem';

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Web Development": FcMultipleDevices,
    "Mobile Development": FcMultipleDevices,
    "Data Science": FcEngineering,
    "Machine Learning": FcEngineering,
    "Cloud Computing": FcSalesPerformance,
    "Cybersecurity": FcSportsMode,
    "Game Development": FcFilmReel,
    "DevOps": FcEngineering,
    "Blockchain": FcSalesPerformance,
    "Artificial Intelligence": FcEngineering,
    "Internet of Things": FcMultipleDevices,
    "Software Engineering": FcEngineering,
    "UI/UX Design": FcOldTimeCamera,
    "Digital Marketing": FcSalesPerformance,
    "Project Management": FcSalesPerformance,
    "Agile Methodologies": FcSalesPerformance,
    "Business Analysis": FcSalesPerformance,
    "Quality Assurance": FcEngineering,
    "Technical Writing": FcMusic,
    "IT Support and Administration": FcMultipleDevices
};


const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
            {items.map((item) => (
                <CategoryItem key={item.id}  label={item.name} icon={iconMap[item.name]} value={item.id}/>
            ))}
        </div>
    )
}

export default Categories

