import { useState } from "react";
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

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedAction, setSelectedAction] = useState("Attempt");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap mb-2 p-2 border rounded">
          <span className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</span>
          {m.content}
        </div>
      ))}

      <form onSubmit={handleFormSubmit} className="fixed bottom-0 w-full max-w-2xl p-2 mb-8">
        <div className="flex w-full items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-28">{selectedAction}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Say...</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => setSelectedAction("Whisper")}>
                      Whisper
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedAction("Say")}>
                      Say
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedAction("Shout")}>
                      Shout
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onSelect={() => setSelectedAction("Attempt to")}>
                Attempt an action
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            value={input}
            placeholder={`${selectedAction}...`}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
