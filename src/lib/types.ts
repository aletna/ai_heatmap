export interface ConversationData {
    day: string;
    value: number;
}

export interface YearStats {
    totalConversations: number;
    mostActiveDay: ConversationData;
}

export interface HeatmapDataPoint {
    day: string;
    value: number;
}

export interface Conversation {
    create_time: number;
    // ignore other fields
}

export interface DateGroups {
    [key: string]: number;
}