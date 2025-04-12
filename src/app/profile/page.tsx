import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { selectUserInfo, insertUserInfo, updateUserInfo } from "./actions";
import { Input } from "@/components/ui/input";
import { AiModelType } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { SubmitButton } from "../../components/submit-button";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  let userInfos = await selectUserInfo(data.user.id);

  if (userInfos.length === 0) {
    console.log("No user info object found. Creating new");
    userInfos = await insertUserInfo(data.user.id);
  }

  const userInfo = userInfos[0];

  async function handleFormAction(formData: FormData) {
    "use server";

    const username = formData.get("username") as string;
    const aiApiKey = formData.get("ai_api_key") as string;
    const aiModel = formData.get("ai_model") as AiModelType;

    await updateUserInfo({
      id: userInfo.id,
      username,
      ai_api_key: aiApiKey,
      ai_model: aiModel,
    });

    // Force a complete refresh of the page to get fresh data
    redirect("/profile");
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information and AI preferences.
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

            <div className="space-y-2">
              <Label htmlFor="ai_api_key" className="font-medium">
                AI API Key
              </Label>
              <Input
                id="ai_api_key"
                name="ai_api_key"
                defaultValue={userInfo.ai_api_key || ""}
                className="w-full"
                type="password"
                placeholder="Enter your AI API key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored securely and used to interact with AI
                services. Currently, only OpenAI API keys are supported.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai_model" className="font-medium">
                AI Model
              </Label>
              <Select
                name="ai_model"
                defaultValue={userInfo.ai_model || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="gpt-4o"
                    className="flex flex-col items-start"
                  >
                    <span>GPT-4o</span>
                    <span className="text-xs text-muted-foreground">
                      Most capable model, provides detailed narratives
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="gpt-4o-mini"
                    className="flex flex-col items-start"
                  >
                    <span>GPT-4o mini</span>
                    <span className="text-xs text-muted-foreground">
                      Faster responses, more economical
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose which AI model powers your adventure.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-6">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
