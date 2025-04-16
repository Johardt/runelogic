import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import { selectUserInfo, insertUserInfo, updateUserInfo } from "./actions";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { SubmitButton } from "../../components/submit-button";
import { ApiSettings } from "@/components/api-settings";
import { AiModelType } from "@/db/schema";

export default async function PrivatePage() {
  const { error, user } = await getUser();
  if (error || !user) {
    redirect("/login");
  }

  let userInfos = await selectUserInfo(user.id);

  if (userInfos.length === 0) {
    console.log("No user info object found. Creating new");
    userInfos = await insertUserInfo(user.id);
  }

  const userInfo = userInfos[0];

  async function handleFormAction(formData: FormData) {
    "use server";

    const username = formData.get("username") as string;

    await updateUserInfo({
      id: userInfo.id,
      username,
      ai_api_key: userInfo.ai_api_key || "", // Handle null case
      ai_model: (userInfo.ai_model || "gpt-4o-mini") as AiModelType, // Handle null case
    });

    // Force a complete refresh of the page to get fresh data
    redirect("/profile");
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Update your basic profile information.
          </CardDescription>
        </CardHeader>
        <form action={handleFormAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={userInfo.username || ""}
                className="w-full"
                placeholder="Enter your username"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your username does not need to be unique.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <ApiSettings />
      <Toaster />
    </div>
  );
}
