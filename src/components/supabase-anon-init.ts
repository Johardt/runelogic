"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function SupabaseAnonymousInit() {
  useEffect(() => {
    const supabase = createClient();

    async function initAnon() {
      const sessionRes = await supabase.auth.getSession();

      if (!sessionRes.data.session) {
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
          console.error("Anonymous sign-in failed", error);
          return;
        }

        if (data?.user?.id) {
          // Call your init API
          await fetch("/api/user/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    initAnon();
  }, []);

  return null;
}
