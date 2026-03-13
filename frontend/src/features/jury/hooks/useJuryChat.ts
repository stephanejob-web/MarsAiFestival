import { useState } from "react";

export interface ChatMessage {
    id: number;
    author: string;
    initials: string;
    text: string;
    color: "aurora" | "lavande" | "solar" | "mist";
}

export interface UseJuryChatReturn {
    messages: ChatMessage[];
    inputValue: string;
    unreadCount: number;
    setInputValue: (value: string) => void;
    sendMessage: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 1,
        author: "Thomas Richard",
        initials: "TR",
        text: "Film 3 vraiment interessant, on en parle apres ?",
        color: "aurora",
    },
    {
        id: 2,
        author: "Sophie Bernard",
        initials: "SB",
        text: "Oui, la fin est ambigue mais j aime beaucoup.",
        color: "lavande",
    },
];

const useJuryChat = (): UseJuryChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState<string>("");
    const [unreadCount] = useState<number>(2);

    const sendMessage = (): void => {
        const text = inputValue.trim();
        if (!text) return;

        const newMessage: ChatMessage = {
            id: Date.now(),
            author: "Marie Lefebvre",
            initials: "ML",
            text,
            color: "mist",
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");
    };

    return {
        messages,
        inputValue,
        unreadCount,
        setInputValue,
        sendMessage,
    };
};

export default useJuryChat;
