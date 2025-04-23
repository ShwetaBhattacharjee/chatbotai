import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/openai",
  });

  const chatContainer = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true); // Controls visibility of suggestions

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
    setShowSuggestions(false); // Hide suggestions after click
  };

  const renderResponse = () => {
    return (
      <div className="response">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`chat-line ${m.role === "user" ? "user-chat" : "ai-chat"}`}
          >
            <Image
              className="avatar"
              alt="avatar"
              width={40}
              height={40}
              src={m.role === "user" ? "/user-avatar.jpg" : "/ai-avatar.png"}
            />
            <div style={{ width: "100%", marginLeft: "16px" }}>
              <p className="message">{m.content}</p>
              {index < messages.length - 1 && <div className="horizontal-line" />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={chatContainer} className="chat">
      {renderResponse()}
      {showSuggestions && (
        <PromptSuggestions
          label="Try these prompts ✨"
          onSuggestionClick={handlePromptClick}
          suggestions={suggestions}
        />
      )}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          if (input.trim() !== "") {
            setShowSuggestions(false); // Hide suggestions on manual message
          }
        }}
        className="chat-form"
      >
        <input
          name="input-field"
          type="text"
          placeholder="Say anything"
          onChange={handleInputChange}
          value={input}
        />
        <button type="submit" className="send-button" />
      </form>
    </div>
  );
};

export default Chat;

interface PromptSuggestionsProps {
  label: string;
  onSuggestionClick: (suggestion: string) => void;
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
            onClick={() => onSuggestionClick(suggestion)}
            className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
