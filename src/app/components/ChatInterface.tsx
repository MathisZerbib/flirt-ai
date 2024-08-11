// ChatInterface.tsx
import React, { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInterfaceProps {
  onSubmit: (message: string) => void;
  isResponding: boolean;
}

export function ChatInterface({ onSubmit, isResponding }: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow bg-white"
      />
      <Button type="submit" disabled={isResponding}>
        <FaPaperPlane />
      </Button>
    </form>
  );
}
