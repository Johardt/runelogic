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
    // Make main fill the height provided by the layout
    <main className="h-full">
      {/* Chat component now handles its own height and scrolling */}
      <Chat conversationId={id} />
    </main>
  );
}
