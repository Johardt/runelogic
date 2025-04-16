"use client";

import { use } from "react";
import Chat from "@/components/chat";

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Chat conversationId={id} />
    </main>
  );
}
