"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { Button } from "@/components/ui/button"; // Import Button
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

  // Renamed function, removed event and confirm()
  const performDelete = async () => {
    try {
      const res = await fetch(`/api/adventures?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Adventure deleted");
        router.refresh(); // refresh current page
      } else {
        // Try to parse error message from response
        const errorData = await res.json().catch(() => ({}));
        toast.error(
          `Failed to delete adventure: ${errorData.error || res.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error deleting adventure:", error);
      toast.error("An unexpected error occurred while deleting the adventure.");
    }
  };

  return (
    // Wrap everything in AlertDialog
    <AlertDialog>
      {/* Removed outer Link */}
      <Card className="hover:shadow-md transition relative h-72 flex flex-col">
        {" "}
        {/* Added flex flex-col */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          {" "}
          {/* Adjusted padding */}
          {/* Link only wraps the title now */}
          <Link href={`/adventures/${id}`} className="flex-grow mr-2">
            {" "}
            {/* Added margin */}
            <CardTitle className="hover:underline">
              {title || "Untitled Adventure"}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Use Button for trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 flex-shrink-0"
              >
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Use AlertDialogTrigger for delete */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()} // Prevent dropdown closing
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {/* Link wraps the content area */}
        <Link
          href={`/adventures/${id}`}
          className="flex flex-col flex-grow overflow-hidden"
        >
          {" "}
          {/* Added flex, flex-grow, overflow */}
          <CardContent className="flex-grow pt-0">
            {" "}
            {/* Removed default padding-top */}
            <p className="text-sm text-muted-foreground">
              Started:{" "}
              {createdAt ? (
                <>
                  {format(new Date(createdAt), "dd.MM.yyyy")} (
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                  })}
                  )
                </>
              ) : (
                "Unknown"
              )}
            </p>
            {/* Add other content here if needed */}
          </CardContent>
        </Link>
      </Card>

      {/* AlertDialog Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            adventure &quot;{title || "Untitled Adventure"}&quot; and all its
            messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Call performDelete on action click */}
          <AlertDialogAction
            onClick={performDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
