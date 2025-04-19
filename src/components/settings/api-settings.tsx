"use client";

import { useApiSettings } from "./useApiSettings";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { JSX } from "react";
import { Bot, BrainCircuit, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ApiSettings() {
  const {
    apiKey,
    googleApiKey,
    model,
    models,
    storageType,
    isSaving,
    setApiKey,
    setGoogleApiKey,
    setModel,
    setStorageType,
    save,
    isLoading,
  } = useApiSettings();

  const vendorIcons: Record<string, JSX.Element> = {
    openai: <BrainCircuit className="w-4 h-4 text-primary mr-2" />,
    google: <Bot className="w-4 h-4 text-primary mr-2" />,
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI API Settings</CardTitle>
        <CardDescription>
          Configure your API keys and choose your default model.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Storage Location</Label>
            <Select
              value={storageType}
              onValueChange={(val) =>
                setStorageType(val as "client" | "server")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">Store on Server</SelectItem>
                <SelectItem value="client">Store on Device</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key">OpenAI API Key</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Input
                id="api_key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_api_key">Google API Key</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Input
                id="google_api_key"
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Default Model</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-50 rounded-md" />
            ) : (
              <Select value={model} onValueChange={(val) => setModel(val)}>
                <SelectTrigger className="justify-start text-left">
                  <div className="flex items-center gap-2 px-3 py-2 w-full">
                    {(() => {
                      const selectedModel = models.find(
                        (m) => m.modelId === model,
                      );

                      if (!selectedModel) {
                        return (
                          <span className="text-muted-foreground">
                            Select model
                          </span>
                        );
                      }

                      return (
                        <>
                          {vendorIcons[selectedModel.vendorId ?? ""] ?? (
                            <Zap className="w-4 h-4 text-muted mr-2" />
                          )}
                          <span>{selectedModel.displayName}</span>
                        </>
                      );
                    })()}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {["openai", "google"].map((vendor, idx, arr) => {
                    const vendorModels = models.filter(
                      (m) => m.vendorId === vendor,
                    );
                    if (vendorModels.length === 0) return null;

                    return (
                      <SelectGroup key={vendor}>
                        <SelectLabel className="flex items-center gap-2 capitalize">
                          {vendorIcons[vendor]} {vendor}
                        </SelectLabel>

                        {vendorModels.map((m) => (
                          <SelectItem key={m.modelId} value={m.modelId}>
                            <div className="flex items-center gap-2 text-left">
                              {vendorIcons[m.vendorId ?? ""] ?? (
                                <Zap className="w-4 h-4 text-muted mr-2" />
                              )}

                              <div className="flex flex-col">
                                <span>{m.displayName}</span>
                                {m.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {m.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}

                        {idx < arr.length - 1 && <SelectSeparator />}
                      </SelectGroup>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="cursor-pointer">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
