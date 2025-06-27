"use client";
import { Chapter } from '@/lib/generated/prisma';
import React, { useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface ChapterListProps {
    items: Chapter[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}

const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [chapters, setChapters] = React.useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        setChapters(items);
    }, [items])

    if (!isMounted) {
        // setIsMounted(true);
        return null;
    }

    return (
        <DragDropContext onDragEnd={() => { }}>
            <Droppable droppableId='chapters'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapters, index) => (
                            <Draggable key={chapters.id} draggableId={chapters.id} index={index}>
                                {(provided) => (
                                    <div className={cn('flex items-center gap-x-2  bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm', chapters.isPublished && "bg-sky-200 text-sky-700")} ref={provided.innerRef} {...provided.draggableProps} >
                                        <div {...provided.dragHandleProps} className={cn('px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition', chapters.isPublished && "border-r-sky-200 hover:bg-sky-200")}>
                                            <Grip className='h-5 w-5' />
                                        </div>
                                        {chapters.title}
                                        <div className='ml-auto pr-2 flex items-center gap-x-2'>
                                            {chapters.isFree && (
                                                <Badge>Free</Badge>
                                            )}
                                            <Badge className={cn("bg-slate-500 ", chapters.isPublished && "bg-sky-700")}>{chapters.isPublished ? "Published" : "Drafted"}</Badge>
                                            <Pencil onClick={() => onEdit(chapters.id)} className='h-4 w-4 cursor-pointer hover:opacity-75 transition'/>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </DragDropContext>
    )
}

export default ChapterList
