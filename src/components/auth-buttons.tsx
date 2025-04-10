import { createClient } from "@/utils/supabase/server";
import User from "@geist-ui/icons/user";
import Link from "next/link";

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
      <div>
        <Link href="/profile">
          <User color="black" size={28} />
        </Link>
      </div>
    );
  }
}
