import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConversationCard } from "@/components/conversation-card";

export default async function Home() {
  const { error, user } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userId = user.id;

  const recentConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt)) // descending order
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link href="/adventures/new">
        <Button size="lg" className="w-full text-xl py-6 cursor-pointer">
          ➕ Start New Adventure
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
        {recentConversations.map((c) => (
          <ConversationCard
            key={c.id}
            id={c.id}
            title={c.title}
            createdAt={c.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
