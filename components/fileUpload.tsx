"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone endpoint={endpoint} onClientUploadComplete={
            (res) => {
                onChange(res?.[0].url);
            }
        } onUploadError={(error: Error) => {
            toast.error(`Error uploading file: ${error.message}`);
        }} />

    )
}