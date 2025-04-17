import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat-input";
import { AiModelType } from "@/db/schema";
import { decrypt } from "@/utils/encryption";
import { STORAGE_KEYS } from "@/utils/local-storage";

interface ChatProps {
  conversationId: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const [clientSettings, setClientSettings] = useState<{
    storageType: string | null;
    apiKey: string | null;
    model: AiModelType | null;
  } | null>(null);

  const { messages, input, handleInputChange, append, setMessages, setInput } =
    useChat({
      api: "/api/chat",
      body: { clientSettings, conversationId },
      onFinish: async (message) => {
        // Save assistant message to DB
        await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId,
            role: message.role,
            content: message.content,
          }),
        });
      },
    });

  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth", 
    });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load past messages on mount
  useEffect(() => {
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }));
        setMessages(formatted);
      })
      .catch(console.error);
  }, [conversationId, setMessages]);

  // Load client config
  useEffect(() => {
    const loadClientSettings = async () => {
      const storageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
      if (storageType === "client") {
        try {
          const res = await fetch("/api/profile/key", { method: "POST" });
          const { key } = await res.json();
          const encryptedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
          const encryptedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
          if (encryptedApiKey) {
            const apiKey = await decrypt(encryptedApiKey, key);
            const model = encryptedModel
              ? ((await decrypt(encryptedModel, key)) as AiModelType)
              : null;
            setClientSettings({ storageType, apiKey, model });
          }
        } catch (err) {
          console.error("Client settings error:", err);
        }
      }
    };
    loadClientSettings();
  }, []);

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
    };

    // Save user message
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        conversationId,
        role: "user",
        content: input,
      }),
    });

    // Stream assistant response via append (triggers onFinish)
    append(userMessage);

    setInput("");
  };

  const renderMessageParts = (message: any) => (
    <div
      className={`whitespace-pre-wrap p-3 border rounded ${
        message.role === "assistant" ? "bg-gray-50" : ""
      }`}
    >
      <span className="font-bold">
        {message.role === "user" ? "You: " : "AI: "}
      </span>
      {Array.isArray(message.parts)
        ? message.parts.map((part: any, i: number) => {
            if (part.type === "text") return <span key={i}>{part.text}</span>;
            return null;
          })
        : message.content}
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-2xl w-full mx-auto pb-16">
      <div ref={messagesEndRef} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Your adventure begins here...
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>{renderMessageParts(message)}</div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-neutral-300">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
