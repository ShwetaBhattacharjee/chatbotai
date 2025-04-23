"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useChat } from "ai/react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const chatContainer = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/openai",
  });

  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    "Generate a list of five companies.",
    "Generate a list of five popular startups.",
    "Generate a list of five well-known tech companies.",
  ];

  const scroll = () => {
    if (chatContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current;
      if (scrollHeight >= scrollTop + offsetHeight) {
        chatContainer.current.scrollTo(0, scrollHeight + 200);
      }
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]);

  const handlePromptClick = (suggestion: string) => {
    append({ role: "user", content: suggestion });
    setShowSuggestions(false);
  };

  const renderMessages = () => {
    return (
      <div className="space-y-4">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "user" ? null : (
              <Image
                src="/ai-avatar.png"
                alt="AI Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div className="bg-gray-100 text-black p-3 rounded-lg max-w-[80%]">
              <p>{m.content}</p>
            </div>
            {m.role === "user" && (
              <Image
                src="/user-avatar.jpg"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#1F2937] hover:bg-[#111827] text-white p-3 rounded-full shadow-xl z-50"
        aria-label="Toggle Chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300 flex flex-col">
          {/* Chat content */}
          <div className="flex-1 p-4 overflow-y-auto" ref={chatContainer}>
            {renderMessages()}
            {showSuggestions && (
              <div className="mt-4">
                <h2 className="text-center text-md font-semibold mb-2">Try these prompts ✨</h2>
                <div className="grid grid-cols-3 gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handlePromptClick(suggestion)}
                      className="bg-white text-black border border-gray-300 px-2 py-1 rounded-xl text-xs hover:bg-gray-100 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="p-2 border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type something..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-[#1F2937] text-white px-4 py-2 rounded-lg hover:bg-[#111827] text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
