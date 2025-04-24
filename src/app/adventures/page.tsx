import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { adventures } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ConversationCardList } from "@/components/conversation-card-list";
import { selectAdventureSchema } from "@/db/validators/adventures";

export default async function AdventuresPage() {
  const { user } = await getUser();

  let allConversations: Array<typeof selectAdventureSchema._output> = [];

  if (user) {
    allConversations = await db
      .select()
      .from(adventures)
      .where(eq(adventures.userId, user.id))
      .orderBy(desc(adventures.createdAt))
      .limit(5);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Adventures</h1>
        <Link href="/adventures/new">
          <Button className="cursor-pointer">Start New Adventure</Button>
        </Link>
      </div>

      {allConversations.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <p className="mb-4 text-gray-500">
            You haven&apos;t started any adventures yet.
          </p>
          <Link href="/adventures/new">
            <Button className="cursor-pointer">
              Start Your First Adventure
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ConversationCardList adventures={allConversations} />
        </div>
      )}
    </div>
  );
}
