"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const [showSuccess, setShowSuccess] = useState(false);

  // Show toast when form transitions from pending to not pending (completed)
  if (pending === false && showSuccess === true) {
    toast("Profile updated", {
      description: "Your settings have been saved successfully.",
    });
    setShowSuccess(false);
  }

  return (
    <Button
      type="submit"
      className="px-8 cursor-pointer"
      disabled={pending}
      onClick={() => {
        if (!pending) {
          setShowSuccess(true);
        }
      }}
    >
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}
