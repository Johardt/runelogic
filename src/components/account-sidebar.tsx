"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Users, Mail, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

interface AccountSidebarProps {
  username: string;
}

export function AccountSidebar({ username }: AccountSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar>
            <AvatarImage src="/user.jpg" alt="User avatar" />
            <AvatarFallback>
              {username.at(0)?.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-64 p-6 space-y-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/user.jpg" alt="User avatar" />
              <AvatarFallback>
                {username.at(0)?.toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{username}</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/characters" onClick={() => setOpen(false)}>
              <Users className="w-4 h-4 mr-2" />
              My Characters
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/messages" onClick={() => setOpen(false)}>
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/profile" onClick={() => setOpen(false)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
          <LogoutButton className="w-full" onLogoutAction={() => setOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
