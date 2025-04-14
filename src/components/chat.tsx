import { useState, useMemo, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat-input";
import { Badge } from "@/components/ui/badge";
import { AiModelType } from "@/db/schema";
import { decrypt } from "@/utils/encryption";
import { STORAGE_KEYS } from "@/utils/local-storage";


// Define the structure for an action
interface Action {
  id: string;
  uiName: string;
  prefix: string;
}

// Define available actions
const availableActions: Action[] = [
  { id: "attempt", uiName: "Attempt", prefix: "You attempt to" },
  { id: "plan", uiName: "Plan", prefix: "You plan to" },
  { id: "whisper", uiName: "Whisper", prefix: "You whisper" },
  { id: "say", uiName: "Say", prefix: "You say" },
  { id: "shout", uiName: "Shout", prefix: "You shout" },
];

// Helper array for identifying say actions by id
const sayActionIds = ["whisper", "say", "shout"];

export default function Chat() {
  // Get client settings
  const [clientSettings, setClientSettings] = useState<{
    storageType: string | null;
    apiKey: string | null;
    model: AiModelType | null;
  } | null>(null);

  // Load client settings on component mount
  useEffect(() => {
    const loadClientSettings = async () => {
      const storageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
      
      if (storageType === 'client') {
        try {
          // Get encryption key from server
          const keyResponse = await fetch('/api/profile/key', {
            method: 'POST',
          });
          
          if (keyResponse.ok) {
            const { key } = await keyResponse.json();
            
            // Get encrypted values
            const encryptedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
            const encryptedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
            
            // Decrypt values if they exist
            if (encryptedApiKey) {
              const apiKey = await decrypt(encryptedApiKey, key);
              const model = encryptedModel ? await decrypt(encryptedModel, key) as AiModelType : null;
              
              setClientSettings({
                storageType,
                apiKey,
                model
              });
            }
          }
        } catch (error) {
          console.error("Failed to load client settings:", error);
        }
      }
    };
    
    loadClientSettings();
  }, []);

  const { messages, input, handleInputChange, append, setInput } = useChat({
    api: "/api/chat",
    body: {
      clientSettings
    }
  });

  const [selectedActionId, setSelectedActionId] = useState<string>("attempt");

  const selectedAction = useMemo(() => {
    return (
      availableActions.find((action) => action.id === selectedActionId) ||
      availableActions[0]
    );
  }, [selectedActionId]);

  // Handle form submission with action prefix
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim()) return;

    // Create content with action prefix
    const messageContent = `${selectedAction.prefix} ${input}`;

    // Use append from useChat to add the message
    append({
      role: "user",
      content: messageContent,
    });

    setInput("");
  };

  // Render message parts according to their type
  const renderMessageParts = (message: any) => {
    return (
      <div
        className={`whitespace-pre-wrap p-3 border rounded ${message.role === "assistant" ? "bg-gray-50" : ""}`}
      >
        <span className="font-bold">
          {message.role === "user" ? "You: " : "AI: "}
        </span>
        {message.parts?.map((part: any, i: number) => {
          switch (part.type) {
            case "text":
              return <span key={i}>{part.text}</span>;

            case "tool-invocation":
              return (
                <div key={i} className="my-2 p-2 border rounded bg-blue-50">
                  <Badge variant="outline" className="mb-1">
                    Tool Used: {part.toolInvocation.toolName}
                  </Badge>
                  <div className="text-sm font-mono">
                    {JSON.stringify(part.toolInvocation.input, null, 2)}
                  </div>
                </div>
              );

            case "tool-result":
              return (
                <div key={i} className="my-2 p-2 border rounded bg-green-50">
                  <Badge variant="outline">Tool Result</Badge>
                  <div className="font-mono text-sm mt-1">
                    {typeof part.result === "object"
                      ? JSON.stringify(part.result, null, 2)
                      : String(part.result)}
                  </div>
                </div>
              );

            case "reasoning":
              return (
                <div key={i} className="my-2 p-2 border rounded bg-yellow-50">
                  <Badge variant="outline" className="mb-1">
                    AI Reasoning
                  </Badge>
                  <div className="text-sm">{part.reasoning}</div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto p-4">
      {/* Messages container */}
      <div className="mb-16">
        {messages.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Your adventure begins here...
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>{renderMessageParts(message)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Use the ChatInput component */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        selectedAction={selectedAction}
        setSelectedActionId={setSelectedActionId}
        availableActions={availableActions}
        sayActionIds={sayActionIds}
      />
    </div>
  );
}
