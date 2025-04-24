"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function LogoutButton({
  className = "",
  onLogoutAction = () => {},
}: {
  className?: string;
  onLogoutAction?: () => void;
}) {
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user");
      const { user } = await res.json();
      setIsAnonymous(user && !user.email);
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    onLogoutAction();
    router.push("/logout");
  };

  if (isAnonymous === null) return null;

  if (!isAnonymous) {
    return (
      <Button
        variant="ghost"
        className={`justify-start text-destructive ${className}`}
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log out
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={`justify-start text-destructive ${className}`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;re currently signed in as a guest. Logging out will make your
            characters and adventures inaccessible unless you sign up first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href="/signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Log out anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
