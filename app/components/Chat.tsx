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
            <div className="mx-2 max-w-[80%] bg-gray-100 text-black p-3 rounded-xl">
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
      className="max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white h-[90vh] overflow-y-auto flex flex-col"
    >
      {renderResponse()}

      {showSuggestions && (
        <div className="mb-4">
          <h2 className="text-center text-lg font-semibold mb-2">Try these prompts ✨</h2>
          <div className="flex flex-wrap gap-4 justify-between">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handlePromptClick(suggestion)}
                className="flex-1 min-w-[100px] text-sm rounded-xl border bg-white text-black p-3 hover:bg-gray-100 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-auto flex items-center gap-2 border-t pt-4">
        <input
          name="input-field"
          type="text"
          placeholder="Say anything"
          onChange={handleInputChange}
          value={input}
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
