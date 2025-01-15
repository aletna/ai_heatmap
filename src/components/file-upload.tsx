"use client";

import { ChangeEvent } from "react";

interface FileUploadProps {
    onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-600">
                <p>
                    Upload your ChatGPT conversations JSON file. To export your
                    data:
                </p>
                <ol className="list-decimal ml-6 mt-2">
                    <li>
                        Go to{" "}
                        <span className="font-bold">ChatGPT Settings</span>{" "}
                        {">"} <span className="font-bold">Data controls</span>{" "}
                        {">"} <span className="font-bold">Export</span>
                    </li>
                    <li>Extract the zip file</li>
                    <li>
                        Upload the{" "}
                        <span className="font-bold">conversations.json</span>{" "}
                        file
                    </li>
                </ol>
            </div>

            <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 cursor-pointer file:cursor-pointer
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
            />
        </div>
    );
}
