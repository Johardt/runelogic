import { createClient } from "@/utils/supabase/server";
import { User, LogOut, Mail } from "@geist-ui/icons";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export async function AuthButtons() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return (
      <div className="flex-row">
        <Link href="/login" className="mx-5 text-neutral-800">
          Log in
        </Link>
        <Link href="/signup" className="mx-5 text-neutral-800">
          Sign up
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center space-x-4">
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
          <DropdownMenuContent className="min-w-[200px] mt-2 p-1 bg-white shadow-md rounded-md">
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded hover:bg-gray-100"
              >
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/logout"
                className="flex items-center px-3 py-2 rounded hover:bg-gray-100"
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
