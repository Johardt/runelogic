import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import {
  getUserInfo,
  insertUserInfo,
  updateUserInfoSecure,
} from "@/db/services/userInfos";
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
import { ApiSettings } from "@/components/settings/api-settings";
import { Button } from "@/components/ui/button";

export default async function PrivatePage() {
  const { error, user } = await getUser();
  if (error || !user) {
    redirect("/login");
  }

  let [userInfo] = await getUserInfo(user.id);

  if (!userInfo) {
    console.log("No user info object found. Creating new");
    const [inserted] = await insertUserInfo(user.id);
    userInfo = inserted;
  }

  async function handleFormAction(formData: FormData) {
    "use server";

    const username = formData.get("username") as string;

    await updateUserInfoSecure({
      id: userInfo.id,
      username,
      openaiApiKey: userInfo.openaiApiKey ?? undefined,
      googleApiKey: userInfo.googleApiKey ?? undefined,
      aiModel: userInfo.aiModel ?? "gpt-4o-mini",
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
            <Button
              type="submit"
              className="cursor-pointer"
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <ApiSettings />
      <Toaster />
    </div>
  );
}
