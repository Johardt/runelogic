import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
}: ChatInputProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 px-4">
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-end space-x-2 rounded-xl p-3 bg-card text-card-foreground shadow-sm border border-border"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="What do you do?"
            rows={1}
            className="flex-1 resize-none !text-[16px] leading-relaxed bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
          />
          <Button type="submit" className="h-10 px-4">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
