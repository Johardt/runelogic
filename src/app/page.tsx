import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { adventures } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { Play } from "lucide-react";
import { ConversationCardList } from "@/components/conversation-card-list";
import { getUserInfo } from "@/db/services/userInfos";
import { selectAdventureSchema } from "@/db/validators/adventures";

export default async function Home() {
  const { user } = await getUser();

  let recentConversations: Array<typeof selectAdventureSchema._output> = [];
  let username = "Adventurer";

  if (user) {
    const [userInfo] = await getUserInfo(user.id);
    if (userInfo?.username) {
      username = userInfo.username;
    }

    recentConversations = await db
      .select()
      .from(adventures)
      .where(eq(adventures.userId, user.id))
      .orderBy(desc(adventures.createdAt))
      .limit(5);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {user && !user.email && (
        <div className="border border-yellow-300 bg-yellow-100 text-yellow-900 p-4 rounded-md shadow-sm mb-6">
          <div className="flex justify-between items-center flex-col md:flex-row gap-3 md:gap-0">
            <span>
              You&apos;re playing as a guest. Your adventures are stored
              temporarily and may be lost if you clear your browser data.
            </span>
            <div className="flex gap-2">
              <Link href="/signup">
                <Button size="sm" variant="default" className="cursor-pointer">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" variant="outline" className="cursor-pointer">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

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
