import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/openai",
  });

  const chatContainer = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true); // State to control visibility of suggestions

  // List of prompt suggestions to show to the user
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

  // Function to handle appending a prompt suggestion as a message directly
  const handlePromptClick = (suggestion: string) => {
    // Append the suggestion as a user message directly
    append({ role: "user", content: suggestion });
    setShowSuggestions(false); // Hide the suggestions after selection
  };

  const renderResponse = () => {
    return (
      <div className="response">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`chat-line ${
              m.role === "user" ? "user-chat" : "ai-chat"
            }`}
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
              {index < messages.length - 1 && (
                <div className="horizontal-line" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={chatContainer} className="chat">
      {renderResponse()}
      {/* Render prompt suggestions if available and not already selected */}
      {showSuggestions && (
        <PromptSuggestions
          label="Try these prompts ✨"
          onSuggestionClick={handlePromptClick} // Pass the click handler
          suggestions={suggestions}
        />
      )}
      <form onSubmit={handleSubmit} className="chat-form">
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
