import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConversationCard } from "@/components/conversation-card";
import { ConversationCardList } from "@/components/conversation-card-list";

export default async function AdventuresPage() {
  const { error, user } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userId = user.id;

  const allConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Adventures</h1>
        <Link href="/adventures/new">
          <Button className="cursor-pointer">
            Start New Adventure
          </Button>
        </Link>
      </div>

      {allConversations.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <p className="mb-4 text-gray-500">You haven&apos;t started any adventures yet.</p>
          <Link href="/adventures/new">
            <Button className="cursor-pointer">
              Start Your First Adventure
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ConversationCardList conversations={allConversations} />
        </div>
      )}
    </div>
  );
}