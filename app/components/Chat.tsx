"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/openai",
  });

  const chatContainer = useRef<HTMLDivElement>(null);
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

  const renderResponse = () => {
    return (
      <div className="space-y-4 mb-4">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex items-start ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "user" ? null : (
              <Image
                className="rounded-full"
                alt="AI Avatar"
                width={40}
                height={40}
                src="/ai-avatar.png"
              />
            )}
            <div
              className={`mx-2 max-w-[80%] p-3 rounded-xl ${
                m.role === "user"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <p className="text-sm">{m.content}</p>
            </div>
            {m.role === "user" && (
              <Image
                className="rounded-full"
                alt="User Avatar"
                width={40}
                height={40}
                src="/user-avatar.jpg"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={chatContainer}
      className="max-w-2xl mx-auto p-4 border border-gray-700 rounded-lg shadow-md bg-black h-[90vh] overflow-y-auto flex flex-col text-white"
    >
      {renderResponse()}

      {showSuggestions && (
        <div className="mb-4">
          <h2 className="text-center text-lg font-semibold mb-2">
            Try these prompts ✨
          </h2>
          <div className="flex flex-wrap gap-4 justify-between">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handlePromptClick(suggestion)}
                className="flex-1 min-w-[100px] text-sm rounded-xl border border-gray-600 bg-gray-800 text-white p-3 hover:bg-gray-700 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-auto flex items-center gap-2 border-t border-gray-700 pt-4"
      >
        <input
          name="input-field"
          type="text"
          placeholder="Say anything"
          onChange={handleInputChange}
          value={input}
          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
interface PromptSuggestionsProps {
  label: string;
  onSuggestionClick: (suggestion: string) => void; // Updated prop type
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  onSuggestionClick,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">{label}</h2>
      <div className="flex gap-6 text-sm">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)} // Pass the suggestion string
            className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
