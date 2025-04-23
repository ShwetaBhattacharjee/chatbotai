"use client";

import { useState } from "react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      <button
        onClick={handleToggleChatbot}
        className="fixed bottom-6 right-6 bg-[#1F2937] hover:bg-[#111827] text-white p-3 rounded-full shadow-xl z-50"
        aria-label="Toggle Chatbot"
      >
        <span className="text-xl">💬</span> {/* Using emoji for chat icon */}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <iframe
            src="https://chatbotai-tan-six.vercel.app/"
            title="Chatbot"
            className="w-full h-full rounded-2xl"
            style={{
              margin: 0,
              padding: 0,
              display: "block",
              height: "100%",
              width: "100%",
              backgroundColor: "black",
              colorScheme: "dark",
              border: "none",
            }}
            allow="clipboard-write"
          />
        </div>
      )}
    </>
  );
}
