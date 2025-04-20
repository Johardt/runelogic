"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { insertUserInfo } from "@/db/services/userInfos";

// Update the function signature to accept prevState
export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return an error object instead of redirecting
    return { message: `Login failed: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: user, error } = await supabase.auth.signUp(data);

  if (error) {
    return { message: `Signup failed: ${error.message}` };
  }

  if (user?.user?.id) {
    await insertUserInfo(user.user.id);
  }

  const { error: loginError } = await supabase.auth.signInWithPassword(data);

  if (loginError) {
    return { message: `Login after signup failed: ${loginError.message}` };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
