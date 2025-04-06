import React from "react";
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

// Import the Action interface from the chat component
interface Action {
  id: string;
  uiName: string;
  prefix: string;
}

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  selectedAction: Action;
  setSelectedActionId: (id: string) => void;
  availableActions: Action[];
  sayActionIds: string[];
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  selectedAction,
  setSelectedActionId,
  availableActions,
  sayActionIds,
}: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 border rounded-lg p-2">
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
            placeholder={selectedAction.prefix + "..."}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
} 