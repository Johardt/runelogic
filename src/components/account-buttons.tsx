import { getUser } from "@/utils/supabase/server";
import { User, LogOut, Mail } from "@geist-ui/icons";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export async function AccountButtons() {
  const { user } = await getUser();
  if (user) {
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
                <AvatarImage src="user/profile-pic" /> {/* TODO */}
                <AvatarFallback>
                  <User color="black" size={32}></User>
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] mt-2 p-1 bg-popover shadow-md rounded-md">
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded hover:bg-muted"
              >
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/logout"
                className="flex items-center px-3 py-2 rounded hover:bg-muted"
              >
                <LogOut color="black" />
                <span className="mx-2">Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
}
