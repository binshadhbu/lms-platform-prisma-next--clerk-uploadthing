"use client";
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react'
import "react-quill/dist/quill.snow.css";

import 'react-quill-new/dist/quill.snow.css'

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

const Editor = ({ onChange, value }: EditorProps) => {
    // const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
    const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })


    return (
        <div className='bg-white '>
            <ReactQuill theme='snow' value={value} onChange={onChange}/>

        </div>
    )
}

export default Editor
