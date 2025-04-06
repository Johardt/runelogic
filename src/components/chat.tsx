import { useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

// Define the simplified structure for an action
interface Action {
  id: string;
  uiName: string;
  prefix: string;
}

// Define available actions without isSayAction and placeholderSuffix
const availableActions: Action[] = [
  { id: "attempt", uiName: "Attempt to", prefix: "You attempt to " },
  { id: "plan", uiName: "Plan to", prefix: "You plan to " },
  { id: "whisper", uiName: "Whisper", prefix: "You whisper " },
  { id: "say", uiName: "Say", prefix: "You say " },
  { id: "shout", uiName: "Shout", prefix: "You shout " },
  // Add more actions here
];

// Helper array for identifying say actions by id
const sayActionIds = ["whisper", "say", "shout"];

export default function Chat() {
  const { messages, input, handleInputChange, append, setInput } = useChat();
  const [selectedActionId, setSelectedActionId] = useState<string>("attempt");

  const selectedAction = useMemo(() => {
    return availableActions.find(action => action.id === selectedActionId) || availableActions[0];
  }, [selectedActionId]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    const prefix = selectedAction.prefix;
    const messageContent = `${prefix}${input}`;
    append({ role: 'user', content: messageContent });
    setInput('');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {messages.map(m => {
        let prefixPart = '';
        let contentPart = m.content;

        if (m.role === 'user') {
          const actionPrefix = availableActions.find(action => m.content.startsWith(action.prefix));
          if (actionPrefix) {
            prefixPart = actionPrefix.prefix;
            contentPart = m.content.substring(actionPrefix.prefix.length);
          } else {
            prefixPart = "User: ";
          }
        }

        return (
          <div key={m.id} className="whitespace-pre-wrap mb-2 p-2 border rounded">
            {m.role === 'assistant' ? (
              <>
                <span className="font-bold">AI: </span>
                {m.content}
              </>
            ) : (
              <>
                <span className="font-bold">{prefixPart}</span>
                {contentPart}
              </>
            )}
          </div>
        );
      })}

      <form onSubmit={handleFormSubmit} className="fixed bottom-0 w-full max-w-2xl p-2 mb-8">
        <div className="flex w-full items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-32">{selectedAction.uiName}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Say...</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {availableActions
                      .filter(action => sayActionIds.includes(action.id))
                      .map(action => (
                        <DropdownMenuItem key={action.id} onSelect={() => setSelectedActionId(action.id)}>
                          {action.uiName}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {availableActions
                .filter(action => !sayActionIds.includes(action.id))
                .map(action => (
                  <DropdownMenuItem key={action.id} onSelect={() => setSelectedActionId(action.id)}>
                    {action.uiName}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            value={input}
            placeholder={selectedAction.uiName + "..."}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
