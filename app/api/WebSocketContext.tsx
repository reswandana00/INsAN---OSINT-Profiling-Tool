"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to WebSocket");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
