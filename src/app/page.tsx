import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { adventures } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConversationCard } from "@/components/conversation-card";
import { Play } from "lucide-react";
import { ConversationCardList } from "@/components/conversation-card-list";

export default async function Home() {
  const { error, user } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userId = user.id;

  const recentConversations = await db
    .select()
    .from(adventures)
    .where(eq(adventures.userId, userId))
    .orderBy(desc(adventures.createdAt)) // descending order
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link href="/adventures/new" passHref>
        <Button
          size="lg"
          className="w-full text-lg md:text-xl py-4 md:py-6 mb-6 md:mb-8 flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5" /> Start new Adventure
        </Button>
      </Link>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Adventures</h2>
        <Link href="/adventures">
          <Button variant="outline" size="sm" className="cursor-pointer">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ConversationCardList adventures={recentConversations} />
      </div>
    </div>
  );
}
