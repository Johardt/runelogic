"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { insertUserInfo } from "@/db/services/userInfos";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Get current (anonymous) user ID
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const anonUserId = session?.user?.id;
  const isAnon = session?.user?.is_anonymous;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: `Login failed: ${error.message}` };
  }

  const newUserId = data?.user?.id;

  if (isAnon && anonUserId && newUserId && anonUserId !== newUserId) {
    // TODO: Missing endpoint
    await fetch("/api/user/migrate", {
      method: "POST",
      body: JSON.stringify({ from: anonUserId, to: newUserId }),
      headers: { "Content-Type": "application/json" },
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error: emailError } = await supabase.auth.updateUser({ email });

  if (emailError) {
    if (emailError?.message.includes("already registered")) {
      return {
        message: "This email is already in use. Please log in instead.",
      };
    } else {
      return { message: `Email update failed: ${emailError.message}` };
    }
  }

  const { error: pwError } = await supabase.auth.updateUser({ password });

  if (pwError) {
    return { message: `Password setup failed: ${pwError.message}` };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (userId) {
    await insertUserInfo(userId);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
