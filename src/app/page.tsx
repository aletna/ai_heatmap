"use client";

import { useState } from "react";
import Link from "next/link";

import FileUpload from "@/components/file-upload";
import HeatMap from "@/components/heat-map";
import { processConversationData } from "@/lib/process-data";
import { AppError, handleError } from "@/lib/error-handler";
import { HeatmapDataPoint } from "@/lib/types";

export default function Home() {
    const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            if (!file.name.endsWith(".json")) {
                throw new AppError(
                    "Please upload a valid JSON file",
                    "INVALID_FILE"
                );
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string);
                    const processedData = processConversationData(jsonData);
                    setHeatmapData(processedData);
                } catch (error) {
                    setError(handleError(error));
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                setError(
                    handleError(
                        new AppError("Error reading file", "UPLOAD_ERROR")
                    )
                );
                setLoading(false);
            };

            reader.readAsText(file);
        } catch (error) {
            setError(handleError(error));
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8 max-w-6xl mx-auto flex flex-col gap-6">
            <div className="flex flex-1 flex-col gap-2">
                <h1 className="text-3xl font-bold">AI Conversation Heatmap</h1>

                <div className="prose prose-sm">
                    <p className="text-gray-600">
                        Web implementation of the{" "}
                        <Link
                            href="https://github.com/chiphuyen/aie-book/blob/main/scripts/ai-heatmap.ipynb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            AI Heatmap Jupyter notebook
                        </Link>{" "}
                        created by{" "}
                        <Link
                            href="https://huyenchip.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Chip Huyen
                        </Link>. This web version allows you to easily generate your
                        ChatGPT usage heatmap without needing to run Python code
                        locally.
                    </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex">
                        <FileUpload onUpload={handleFileUpload} />
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {loading && (
                        <div className="text-gray-500">Processing file...</div>
                    )}
                </div>

                {heatmapData.length > 0 && (
                    <div className="w-full mt-4">
                        <HeatMap data={heatmapData} />
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Privacy Notice</h2>
                <p className="text-gray-600">
                    ⚡️ Data is processed entirely in your browser
                    <br />
                    🔒 We don{"'"}t store your conversations or any personal
                    data
                    <br />
                    💻 This project is{" "}
                    <a
                        href="https://github.com/aletna/ai_heatmap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        open source
                    </a>
                </p>
            </div>
        </main>
    );
}
