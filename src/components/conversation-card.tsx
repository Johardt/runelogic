"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface ConversationCardProps {
  id: string;
  title: string | null;
  createdAt: string | Date | null;
}

export function ConversationCard({
  id,
  title,
  createdAt,
}: ConversationCardProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent triggering the Link

    const res = await fetch(`/api/conversations?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Adventure deleted");
      router.refresh(); // refresh current page
    } else {
      toast.error("Failed to delete adventure");
    }
  };

  return (
    <Link href={`/adventures/${id}`} key={id}>
      <Card className="hover:shadow-md transition relative h-72">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <CardTitle>{title || "Untitled Adventure"}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Started:{" "}
            {createdAt ? (
              <>
                {format(new Date(createdAt), "dd.MM.yyyy")} (
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })})
              </>
            ) : (
              "Unknown"
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
