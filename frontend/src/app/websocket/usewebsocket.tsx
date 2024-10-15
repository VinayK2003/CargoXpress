import { useState, useEffect, useCallback } from 'react';

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

export const useWebSocket = (url: string, onMessage: (data: WebSocketMessage) => void) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log("Connected to WebSocket");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            onMessage({ type: 'error', error: 'WebSocket connection error' });
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [url, onMessage]);

    const sendMessage = useCallback((message: WebSocketMessage) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    }, [ws]);

    return { sendMessage };
};