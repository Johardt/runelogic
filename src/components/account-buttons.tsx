"use client";

import { useEffect, useState } from "react";
import { User, Mail } from "@geist-ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogoutButton } from "./logout-button";

export function AccountButtons() {
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user");
      const json = await res.json();
      setUser(json.user || null);
    }
    load();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-row items-center space-x-4">
      <Link href="/characters" className="flex items-center">
        My Characters
      </Link>
      <p>|</p>
      <Link href="/user/inbox" className="flex items-center">
        <Mail color="text-neutral-800" size={28} />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none cursor-pointer">
            <Avatar>
              <AvatarImage src="user/profile-pic" />
              <AvatarFallback>
                <User color="black" size={32} />
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px] mt-2 p-1 bg-popover shadow-md rounded-md">
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex items-center px-3 py-2 text-sm font-normal rounded hover:bg-muted"
            >
              My Account
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <LogoutButton className="px-3 py-2 text-sm font-normal" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
