"use client";

import { useState, useEffect } from "react";

interface ChatMessage {
  type: "server" | "client";
  content: string;
}

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.onopen = () => {
        setIsConnected(true);
        console.log("Connected to WebSocket");
      };

      ws.onmessage = (event) => {
        setMessages((prev) => [
          ...prev,
          { type: "server", content: event.data },
        ]);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("Disconnected from WebSocket");
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() && socket.readyState === WebSocket.OPEN) {
      socket.send(input);
      setMessages((prev) => [...prev, { type: "client", content: input }]);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div
        className={`text-sm mb-2 ${
          isConnected ? "text-green-500" : "text-red-500"
        }`}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </div>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.type === "client" ? "text-blue-600" : "text-green-600"
            }`}
          >
            {message.type === "client" ? "You: " : "Server: "}
            {message.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
