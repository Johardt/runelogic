import { createClient } from "@/utils/supabase/server";
import { User, LogOut, Mail } from "@geist-ui/icons";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
          <Mail color="text-neutral-800" size={32} />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center">
                <Avatar>
                  <AvatarImage src="user/profile-pic" /> {/* TODO */}
                  <AvatarFallback>
                    <User color="black" size={32}></User>
                  </AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    My Account
                  </NavigationMenuLink>
                </Link>
                <Link href="/auth/logout" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="flex items-center">
                      <LogOut color="black" />
                      <span className="mx-2">Log out</span>
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }
}
