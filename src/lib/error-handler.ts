export class AppError extends Error {
    constructor(
        message: string,
        public code: "INVALID_FILE" | "PROCESSING_ERROR" | "UPLOAD_ERROR"
    ) {
        super(message);
        this.name = "AppError";
    }
}

export function handleError(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }
    return "An unexpected error occurred. Please try again.";
}
