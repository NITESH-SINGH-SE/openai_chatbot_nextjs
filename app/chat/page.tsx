'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const assistantMessage = { role: 'assistant', content: data.reply };

      setMessages((prev) => [...prev, assistantMessage]); // Add assistant reply
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-white text-gray-900 self-start mr-auto border'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
