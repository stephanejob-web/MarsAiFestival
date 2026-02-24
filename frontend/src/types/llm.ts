export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

export interface LLMResponse {
    message: string;
    model: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
}
