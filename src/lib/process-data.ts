"use client"

import { AppError } from "./error-handler";
import { Conversation, DateGroups } from "./types";


export function processConversationData(jsonData: Conversation[]) {
    try {
        const convoTimes = jsonData.map((conv: Conversation) => {
            const timestamp = conv.create_time;
            if (!timestamp) {
                throw new AppError("Invalid conversation data format", "INVALID_FILE");
            }
            return new Date(timestamp * 1000);
        });

        const dateGroups = convoTimes.reduce((acc: DateGroups, date: Date) => {
            const dateStr = date.toISOString().split("T")[0];
            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(dateGroups).map(([day, value]) => ({
            day,
            value,
        }));
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error processing conversation data", "PROCESSING_ERROR");
    }
}
