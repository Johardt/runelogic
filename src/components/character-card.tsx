"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, FileText, Backpack, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { characters } from "@/db/schema";
import React from "react";
import { CharacterSheet } from "@/db/validators/characters";

// Define the expected structure for the character prop
interface CharacterCardProps {
  character: typeof characters.$inferSelect;
  showStartAdventureButton?: boolean;
}

export function CharacterCard({
  character,
  showStartAdventureButton = true, // Default to true
}: CharacterCardProps) {
  const router = useRouter();
  const sheet = character.characterSheet as CharacterSheet | null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/characters/${character.characterId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Character deleted successfully");
        router.refresh(); // Refresh the page to show the updated list
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to delete character: ${errorData.error || res.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("An unexpected error occurred while deleting the character.");
    }
  };

  if (!sheet) {
    // Handle cases where characterSheet might be null or invalid
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Invalid Character Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Could not load character details. ID: {character.characterId}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">{sheet.name}</CardTitle>
          <CardDescription>
            {sheet.race} {sheet.className} - Level {sheet.level}
          </CardDescription>
        </div>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Character
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                character &quot;{sheet?.name || "this character"}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-4">
        <div className="text-sm">
          <span className="font-medium">Alignment:</span>{" "}
          <span className="text-muted-foreground">{sheet.alignment}</span>
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
          {Object.entries(sheet.stats || {}).map(([stat, value]) => (
            <div key={stat} className="flex justify-between">
              <span className="font-medium">{stat.substring(0, 3)}:</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2 justify-start">
        {showStartAdventureButton && (
          <div className="w-full">
            <Button
              variant="default"
              size="sm"
              asChild
              className="flex-grow-0 sm:flex-grow-0 w-full"
            >
              <Link
                href={`/adventures/new?characterId=${character.characterId}`}
              >
                <Play className="w-4 h-4 mr-2" /> Start New Adventure
              </Link>
            </Button>
          </div>
        )}
        <div className="w-full flex justify-between gap-1">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-grow sm:flex-grow-0"
          >
            <Link href={`/characters/${character.characterId}`}>
              <FileText className="w-4 h-4 mr-2" /> View Details
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-grow sm:flex-grow-0"
          >
            <Link href={`/characters/${character.characterId}/inventory`}>
              <Backpack className="w-4 h-4 mr-2" /> View Inventory
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
