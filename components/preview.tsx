"use client";
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react'
import 'react-quill-new/dist/quill.snow.css'

interface PreviewProps {
    value: string;
}

const Preview = ({ value }: PreviewProps) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), []);
    // const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })


    return (

        <ReactQuill theme='bubble' value={value} readOnly />


    )
}

export default Preview
