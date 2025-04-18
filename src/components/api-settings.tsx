"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiModelType, AiModelDescriptions } from "@/db/schema";
import { toast } from "sonner";
import { encrypt, decrypt } from "@/utils/encryption";
import { STORAGE_KEYS } from "@/utils/local-storage";

const DEFAULT_MODEL: AiModelType = "gpt-4o-mini";

// Define types for the state and action
interface SettingsState {
  apiKey: string;
  googleApiKey: string;
  model: AiModelType;
  storageType: string;
  isSaving: boolean;
  serverModel: AiModelType | null;
}

interface SettingsAction {
  type: string;
  payload?: any;
}

// Define the initial state and reducer for managing complex state
const initialState: SettingsState = {
  apiKey: "",
  googleApiKey: "",
  model: DEFAULT_MODEL,
  storageType: "server",
  isSaving: false,
  serverModel: null,
};

function settingsReducer(
  state: SettingsState,
  action: SettingsAction,
): SettingsState {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "SET_GOOGLE_API_KEY":
      return { ...state, googleApiKey: action.payload };
    case "SET_MODEL":
      return { ...state, model: action.payload };
    case "SET_STORAGE_TYPE":
      return { ...state, storageType: action.payload };
    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_SERVER_MODEL":
      return { ...state, serverModel: action.payload };
    default:
      return state;
  }
}

export function ApiSettings() {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { apiKey, googleApiKey, model, storageType, isSaving, serverModel } = state;
  const [isClient, setIsClient] = useState(false);

  // Helper to get vendor for a model name
  const getVendorForModel = useCallback((modelName: string) => {
    // This assumes AiModelDescriptions is populated with vendor info as value or you have a way to get vendor by modelName
    // We'll fetch vendor info from models API response and store it in a local map
    return modelsVendorMap[modelName];
  }, []);

  // Store vendor info for models
  const [modelsVendorMap, setModelsVendorMap] = useState<Record<string, string>>({});

  const getEncryptionKey = useCallback(async (): Promise<string> => {
    const response = await fetch("/api/user/key", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to get encryption key");
    }
    const { key } = await response.json();
    return key;
  }, []);

  const getStorageValue = useCallback(
    async (key: string) => {
      const value = localStorage.getItem(key);
      if (!value) return null;
      try {
        const encryptionKey = await getEncryptionKey();
        return await decrypt(value, encryptionKey);
      } catch {
        return null;
      }
    },
    [getEncryptionKey],
  );

  const setStorageValue = async (key: string, value: string) => {
    const encryptionKey = await getEncryptionKey();
    const encrypted = await encrypt(value, encryptionKey);
    localStorage.setItem(key, encrypted);
  };

  useEffect(() => {
    setIsClient(true);
    const savedStorageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
    if (savedStorageType === "client") {
      dispatch({ type: "SET_STORAGE_TYPE", payload: "client" });
    }

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/models");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const models = await response.json();
        const modelDescriptions = models.reduce((acc: any, model: any) => {
          acc[model.modelName] = model.description;
          return acc;
        }, {});
        Object.assign(AiModelDescriptions, modelDescriptions);
        // Store vendor info
        const vendorMap = models.reduce((acc: any, model: any) => {
          acc[model.modelName] = model.vendor;
          return acc;
        }, {});
        setModelsVendorMap(vendorMap);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }

      try {
        const response = await fetch("/api/user/settings");
        const data = await response.json();
        if (data.model) {
          dispatch({ type: "SET_SERVER_MODEL", payload: data.model });
          if (savedStorageType !== "client") {
            dispatch({ type: "SET_MODEL", payload: data.model });
            if (data.apiKey) {
              dispatch({ type: "SET_API_KEY", payload: data.apiKey });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch server settings:", error);
      }

      if (savedStorageType === "client") {
        try {
          const storedApiKey = await getStorageValue(STORAGE_KEYS.API_KEY);
          const storedModel = (await getStorageValue(
            STORAGE_KEYS.MODEL,
          )) as AiModelType | null;

          if (storedApiKey)
            dispatch({ type: "SET_API_KEY", payload: storedApiKey });
          if (storedModel)
            dispatch({ type: "SET_MODEL", payload: storedModel });
        } catch (error) {
          console.error("Failed to load client settings:", error);
          dispatch({ type: "SET_STORAGE_TYPE", payload: "server" });
          localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "server");
          if (serverModel) {
            dispatch({ type: "SET_MODEL", payload: serverModel });
          }
        }
      }
    };

    loadSettings();
  }, [getStorageValue, serverModel]);

  const handleStorageTypeChange = (value: "server" | "client") => {
    dispatch({ type: "SET_STORAGE_TYPE", payload: value });
    localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, value);

    if (value === "server") {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
      localStorage.removeItem(STORAGE_KEYS.MODEL);
      if (serverModel) {
        dispatch({ type: "SET_MODEL", payload: serverModel });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_IS_SAVING", payload: true });
    try {
      if (storageType === "client") {
        await setStorageValue(STORAGE_KEYS.API_KEY, apiKey);
        await setStorageValue(STORAGE_KEYS.MODEL, model);
        localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "client");

        toast.success("Settings saved to your device");
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.MODEL);
        localStorage.setItem(STORAGE_KEYS.STORAGE_TYPE, "server");

        const formData = new FormData();
        formData.append("openaiApiKey", apiKey);
        formData.append("aiModel", model);

        const response = await fetch("/api/user/settings", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save settings");
        }

        dispatch({ type: "SET_SERVER_MODEL", payload: model });
        toast.success("Settings saved to server");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      dispatch({ type: "SET_IS_SAVING", payload: false });
    }
  };

  // Filter models for dropdown based on which API keys are set
  const filteredModelEntries = Object.entries(AiModelDescriptions).filter(
    ([modelName]) => {
      const vendor = modelsVendorMap[modelName];
      if (!apiKey && !googleApiKey) return false;
      if (vendor === "OpenAI" && apiKey) return true;
      if (vendor === "Google" && googleApiKey) return true;
      return false;
    },
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI API Settings</CardTitle>
        <CardDescription>
          Configure your AI API settings. You can choose to store these settings
          on your device or on our servers.
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
                  <SelectItem value="server">
                    Store on Server (Recommended)
                  </SelectItem>
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
            <Label htmlFor="api_key">OpenAI API Key</Label>
            <Input
              id="api_key"
              type="password"
              value={apiKey}
              onChange={(e) =>
                dispatch({ type: "SET_API_KEY", payload: e.target.value })
              }
              placeholder="Enter your OpenAI API key"
            />
            <p className="text-xs text-muted-foreground">
              This key is used to interact with OpenAI models. If you don&apos;t have one, {" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                get an API key here
              </a>
              .
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_api_key">Google AI API Key</Label>
            <Input
              id="google_api_key"
              type="password"
              value={googleApiKey}
              onChange={(e) =>
                dispatch({ type: "SET_GOOGLE_API_KEY", payload: e.target.value })
              }
              placeholder="Enter your Google AI API key"
            />
            <p className="text-xs text-muted-foreground">
              This key is used to interact with Google AI models. If you don&apos;t have one, {" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                get an API key here
              </a>
              .
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default AI Model</Label>
            <Select
              value={model}
              onValueChange={(value: AiModelType) =>
                dispatch({ type: "SET_MODEL", payload: value })
              }
              defaultValue={DEFAULT_MODEL}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {filteredModelEntries.map(([name, description]) => (
                  <SelectItem
                    key={name}
                    value={name}
                    className="flex flex-col items-start"
                  >
                    <span>{name}</span>
                    {description && (
                      <span className="text-xs text-muted-foreground">
                        {description}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredModelEntries.length === 0 && (
              <p className="text-xs text-destructive mt-1">
                No models available. Please enter an API key.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Choose which AI model powers your adventures. You can override
              this model setting for each adventure.
            </p>
          </div>

          <CardFooter className="px-0 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="px-8 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </CardContent>
      </form>
    </Card>
  );
}
