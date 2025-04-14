"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AiModelType } from "@/db/schema";
import { toast } from "sonner";
import { encrypt, decrypt } from "@/utils/encryption";
import { STORAGE_KEYS } from "@/utils/local-storage";

const DEFAULT_MODEL: AiModelType = "gpt-4o-mini";

export function ApiSettings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<AiModelType>(DEFAULT_MODEL);
  const [storageType, setStorageType] = useState<"server" | "client">("server");
  const [isSaving, setIsSaving] = useState(false);
  const [serverModel, setServerModel] = useState<AiModelType | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Check localStorage after component mounts
  useEffect(() => {
    setIsClient(true);
    const savedStorageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
    if (savedStorageType === 'client') {
      setStorageType('client');
    }
    
    // Make sure we sync data after storage type is set
    const loadSettings = async () => {
      // Try to get server data
      try {
        const response = await fetch("/api/profile/settings");
        const data = await response.json();
        if (data.model) {
          setServerModel(data.model);
          // Set model and API key if we're using server storage
          if (savedStorageType !== 'client') {
            setModel(data.model);
            if (data.apiKey) {
              setApiKey(data.apiKey);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch server settings:", error);
      }

      // Check local storage if we're using client storage
      if (savedStorageType === 'client') {
        try {
          const storedApiKey = await getStorageValue(STORAGE_KEYS.API_KEY);
          const storedModel = await getStorageValue(STORAGE_KEYS.MODEL) as AiModelType | null;
          
          if (storedApiKey) setApiKey(storedApiKey);
          if (storedModel) setModel(storedModel);
        } catch (error) {
          console.error("Failed to load client settings:", error);
          // If we can't load client settings, fall back to server
          setStorageType("server");
          localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "server");
          if (serverModel) {
            setModel(serverModel);
          }
        }
      }
    };

    loadSettings();
  }, []);

  // Function to get the encryption key from the server
  const getEncryptionKey = async (): Promise<string> => {
    const response = await fetch('/api/profile/key', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to get encryption key');
    }
    const { key } = await response.json();
    return key;
  };

  // Function to get storage value
  const getStorageValue = async (key: string) => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      const encryptionKey = await getEncryptionKey();
      return await decrypt(value, encryptionKey);
    } catch {
      return null;
    }
  };

  // Function to set storage value
  const setStorageValue = async (key: string, value: string) => {
    const encryptionKey = await getEncryptionKey();
    const encrypted = await encrypt(value, encryptionKey);
    localStorage.setItem(key, encrypted);
  };

  const handleStorageTypeChange = (value: "server" | "client") => {
    setStorageType(value);
    localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, value);
    
    if (value === "server") {
      // When switching to server storage, clear local storage and use server values
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
      localStorage.removeItem(STORAGE_KEYS.MODEL);
      if (serverModel) {
        setModel(serverModel);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (storageType === "client") {
        // Save encrypted data to local storage
        await setStorageValue(STORAGE_KEYS.API_KEY, apiKey);
        await setStorageValue(STORAGE_KEYS.MODEL, model);
        localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "client");
        
        toast.success("Settings saved to your device");
      } else {
        // Save to server and clear any existing local storage
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.MODEL);
        localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "server");
        
        const formData = new FormData();
        formData.append("ai_api_key", apiKey);
        formData.append("ai_model", model);
        
        const response = await fetch("/api/profile/settings", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save settings");
        }

        setServerModel(model);
        toast.success("Settings saved to server");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI API Settings</CardTitle>
        <CardDescription>
          Configure your AI API settings. You can choose to store these settings on your device or on our servers.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Storage Location</Label>
            {isClient ? (
              <Select
                value={storageType}
                onValueChange={handleStorageTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server">Store on Server (Recommended)</SelectItem>
                  <SelectItem value="client">Store on My Device</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-10 px-3 py-2 border rounded-md bg-background text-sm">
                Store on Server (Recommended)
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {storageType === "server"
                ? "Your API key will be stored securely (encrypted) on our servers."
                : "Your API key will be stored securely (encrypted) in your browser's local storage. This means you'll need to re-enter it if you clear your browser data or use a different browser."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key">API Key</Label>
            <Input
              id="api_key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is used to interact with AI services. Currently, only OpenAI API keys are supported.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Default AI Model</Label>
            <Select 
              value={model} 
              onValueChange={(value: AiModelType) => setModel(value)}
              defaultValue={DEFAULT_MODEL}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o" className="flex flex-col items-start">
                  <span>GPT-4o</span>
                  <span className="text-xs text-muted-foreground">
                    Most capable model, provides detailed narratives
                  </span>
                </SelectItem>
                <SelectItem value="gpt-4o-mini" className="flex flex-col items-start">
                  <span>GPT-4o mini</span>
                  <span className="text-xs text-muted-foreground">
                    Faster responses, more economical
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose which AI model powers your adventures. You can override this model setting for each adventure.
            </p>
          </div>

          <CardFooter className="px-0 flex justify-end">
            <Button type="submit" disabled={isSaving} className="px-8 cursor-pointer">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </CardContent>
      </form>
    </Card>
  );
} 