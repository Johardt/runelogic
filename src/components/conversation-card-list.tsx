"use client";

import { ConversationCard } from "@/components/conversation-card";

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string | Date | null;
}

interface ConversationCardListProps {
  adventures: Conversation[];
}

export function ConversationCardList({ adventures }: ConversationCardListProps) {
  return (
    <>
      {adventures.map((c) => (
        <ConversationCard
          key={c.id}
          id={c.id}
          title={c.title}
          createdAt={c.createdAt}
        />
      ))}
    </>
  );
}
