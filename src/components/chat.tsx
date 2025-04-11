import { useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat-input";

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
  const { messages, input, handleInputChange, append, setInput } = useChat({
    api: "/api/chat",
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
            {messages.map((m) => {
              // For user messages, handle action prefixes for display
              let prefixPart = "";
              let contentPart = m.content;

              if (m.role === "user") {
                const actionPrefix = availableActions.find((action) =>
                  m.content.startsWith(action.prefix),
                );
                if (actionPrefix) {
                  prefixPart = actionPrefix.prefix + " ";
                  contentPart = m.content.substring(actionPrefix.prefix.length);
                } else {
                  prefixPart = "User: ";
                }

                return (
                  <div
                    key={m.id}
                    className="whitespace-pre-wrap p-3 border rounded"
                  >
                    <span className="font-bold">{prefixPart}</span>
                    {contentPart}
                  </div>
                );
              } else if (m.role === "assistant") {
                // Assistant message
                return (
                  <div
                    key={m.id}
                    className="whitespace-pre-wrap p-3 border rounded bg-gray-50"
                  >
                    <span className="font-bold">AI: </span>
                    {m.content}
                  </div>
                );
              } else if (m.role === "system") {
                // System message
                return (
                  <div
                    key={m.id}
                    className="whitespace-pre-wrap p-3 border rounded bg-gray-100"
                  >
                    <span className="font-bold">System: </span>
                    {m.content}
                  </div>
                );
              }
            })}
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
