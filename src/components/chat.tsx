import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat-input";
import { decrypt } from "@/utils/encryption";
import { STORAGE_KEYS } from "@/utils/local-storage";

interface ChatProps {
  conversationId: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const [clientSettings, setClientSettings] = useState<{
    storageType: "client" | "server" | null;
    apiKey: string | null;
    model: string | null;
  } | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    append,
    setMessages,
    setInput,
    status,
  } = useChat({
    api: "/api/chat",
    body: { clientSettings, conversationId },
    onFinish: async (message) => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (!isLoadingMessages) {
      scrollToBottom();
    }
  }, [messages, isLoadingMessages]);

  // Load past messages on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingMessages(true);
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const formatted = data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }));
          setMessages(formatted);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) {
          setIsLoadingMessages(false);
          setTimeout(scrollToBottom, 0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [conversationId, setMessages]);

  useEffect(() => {
    const loadClientSettings = async () => {
      const storageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
      if (storageType === "client") {
        try {
          const res = await fetch("/api/user/key", { method: "POST" });
          const { key } = await res.json();
          const encryptedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
          const encryptedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
          if (encryptedApiKey) {
            const apiKey = await decrypt(encryptedApiKey, key);
            const model = encryptedModel
              ? await decrypt(encryptedModel, key)
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "ready" || !input.trim()) return;

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
    append(userMessage);

    setInput("");
  };

  const renderMessageParts = (message: any) => (
    <div
      className={`whitespace-pre-wrap p-3 rounded ${
        message.role === "assistant" ? "" : "bg-card text-card-foreground"
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
          {isLoadingMessages ? (
            <div className="py-8 text-center text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Your adventure begins here...
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id}>{renderMessageParts(message)}</div>
              ))}
              {status === "submitted" && (
                <div className="whitespace-pre-wrap p-3 rounded">
                  <span className="font-bold">AI: </span>
                  <span className="italic text-muted-foreground">
                    Thinking…
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!isLoadingMessages && (
        <div className="p-4 border-neutral-300">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            status={status}
          />
        </div>
      )}
    </div>
  );
}
