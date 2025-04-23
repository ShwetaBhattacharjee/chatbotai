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

  const handlePromptClick = (suggestion: string) => {
    append({ role: "user", content: suggestion });
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (chatContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current;
      if (scrollHeight >= scrollTop + offsetHeight) {
        chatContainer.current.scrollTo(0, scrollHeight + 200);
      }
    }
  }, [messages]);

  return (
    <div className="h-full w-full flex flex-col p-4 overflow-y-auto space-y-4">
      <div ref={chatContainer} className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex items-start gap-4 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Image
              className="rounded-full"
              alt="avatar"
              width={32}
              height={32}
              src={m.role === "user" ? "/user-avatar.jpg" : "/ai-avatar.png"}
            />
            <div className="bg-gray-100 p-3 rounded-xl max-w-[75%] text-sm">
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {showSuggestions && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Try these prompts ✨</h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handlePromptClick(suggestion)}
                className="bg-white border px-3 py-2 rounded-xl hover:bg-gray-100 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center border-t pt-2"
      >
        <input
          name="input-field"
          type="text"
          placeholder="Say anything..."
          onChange={handleInputChange}
          value={input}
          className="flex-1 border rounded-xl p-2 text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
