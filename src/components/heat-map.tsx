"use client";

import { ConversationData, YearStats } from "@/lib/types";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useState } from "react";

interface HeatMapProps {
    data: ConversationData[];
    year: number;
    stats: YearStats;
}

export default function HeatMap({ data }: { data: ConversationData[] }) {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const [downloading, setDownloading] = useState(false);

    // Split data by year
    const currentYearData = data.filter(item => 
        item.day.startsWith(currentYear.toString())
    );
    const previousYearData = data.filter(item => 
        item.day.startsWith(previousYear.toString())
    );

    const getYearStats = (yearData: typeof data) => ({
        totalConversations: yearData.reduce((sum, item) => sum + item.value, 0),
        mostActiveDay: yearData.reduce((max, item) => 
            item.value > (max?.value || 0) ? item : max, yearData[0]
        ),
    });

    const downloadHeatmap = async () => {
        setDownloading(true);
        try {
            const element = document.getElementById("heatmap-container");
            if (!element) return;

            const canvas = await html2canvas(element, {
                backgroundColor: "#ffffff",
                scale: 2,
            });

            const link = document.createElement("a");
            link.download = `chatgpt-heatmap-${previousYear}-${currentYear}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error downloading heatmap:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your ChatGPT Usage</h2>
                <Button 
                    onClick={downloadHeatmap} 
                    disabled={downloading}
                    variant="outline"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? "Downloading..." : "Download PNG"}
                </Button>
            </div>
            <div id="heatmap-container" className="bg-white p-8 rounded-lg">
                {previousYearData.length > 0 && (
                    <CalendarHeatmap
                        data={previousYearData}
                        year={previousYear}
                        stats={getYearStats(previousYearData)}
                    />
                )}
                <CalendarHeatmap
                    data={currentYearData}
                    year={currentYear}
                    stats={getYearStats(currentYearData)}
                />
            </div>
        </div>
    );
}

function CalendarHeatmap({ year, data, stats }: HeatMapProps) {
    return (
        <div className="mb-12">
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{year} Activity</h2>
                <div className="text-sm text-gray-600">
                    <p>Total conversations: {stats.totalConversations}</p>
                    {stats.mostActiveDay && (
                        <p>
                            Most active day:{" "}
                            {new Date(stats.mostActiveDay.day).toLocaleDateString()}{" "}
                            ({stats.mostActiveDay.value} conversations)
                        </p>
                    )}
                </div>
            </div>
            <div className="h-[200px]">
                <ResponsiveCalendar
                    data={data}
                    from={`${year}-01-01`}
                    to={`${year}-12-31`}
                    emptyColor="#eeeeee"
                    colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
                    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                    yearSpacing={40}
                    monthBorderColor="#ffffff"
                    dayBorderWidth={2}
                    dayBorderColor="#ffffff"
                    legends={[
                        {
                            anchor: "bottom-right",
                            direction: "row",
                            translateY: 36,
                            itemCount: 4,
                            itemWidth: 42,
                            itemHeight: 36,
                            itemsSpacing: 14,
                            itemDirection: "right-to-left",
                        },
                    ]}
                />
            </div>
        </div>
    );
}
