import { ConversationData, YearStats } from "@/lib/types";


export function useHeatmapData(data: ConversationData[]) {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const currentYearData = data.filter((item) =>
        item.day.startsWith(currentYear.toString())
    );
    const previousYearData = data.filter((item) =>
        item.day.startsWith(previousYear.toString())
    );

    const getYearStats = (yearData: ConversationData[]): YearStats => ({
        totalConversations: yearData.reduce((sum, item) => sum + item.value, 0),
        mostActiveDay: yearData.reduce(
            (max, item) => (item.value > (max?.value || 0) ? item : max),
            yearData[0]
        ),
    });

    return {
        currentYear,
        previousYear,
        currentYearData,
        previousYearData,
        currentYearStats: getYearStats(currentYearData),
        previousYearStats: getYearStats(previousYearData),
    };
}
