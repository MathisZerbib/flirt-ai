// MessageDisplay.tsx
import React from "react";

interface Message {
  role: string;
  content: string;
}

interface MessageDisplayProps {
  messages: Message[];
}

export function MessageDisplay({ messages }: MessageDisplayProps) {
  return (
    <div className="max-h-64 overflow-auto p-2 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`inline-flex justify-between items-start px-4 py-2 rounded ${
            msg.role === "user"
              ? "bg-blue-100 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <strong className={`${msg.role === "user" ? "text-right mr-2" : ""}`}>
            {msg.role === "user" ? "You" : "AI"}:
          </strong>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
