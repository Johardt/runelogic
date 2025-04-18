"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/utils/local-storage";
import { decrypt, encrypt } from "@/utils/encryption";
import { toast } from "sonner";
import { ModelResponse } from "@/lib/types/models";

type StorageType = "client" | "server";

export function useApiSettings() {
  const [apiKey, setApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [serverModel, setServerModel] = useState<string | null>(null);
  const [models, setModels] = useState<ModelResponse[]>([]);
  const [storageType, setStorageType] = useState<StorageType>("server");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getEncryptionKey = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/user/key", { method: "POST" });
    const { key } = await res.json();
    return key;
  }, []);

  const getStorageValue = useCallback(
    async (key: string) => {
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        const encKey = await getEncryptionKey();
        return await decrypt(item, encKey);
      } catch {
        return null;
      }
    },
    [getEncryptionKey],
  );

  const setStorageValue = useCallback(
    async (key: string, value: string) => {
      const encKey = await getEncryptionKey();
      const encrypted = await encrypt(value, encKey);
      localStorage.setItem(key, encrypted);
    },
    [getEncryptionKey],
  );

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    const savedStorageType = localStorage.getItem(STORAGE_KEYS.STORAGE_TYPE);
    if (savedStorageType === "client") setStorageType("client");

    try {
      const modelRes = await fetch("/api/models");
      const models = await modelRes.json();
      setModels(models);
    } catch (e) {
      console.error("Failed to fetch models", e);
    }

    if (savedStorageType === "client") {
      const storedKey = await getStorageValue(STORAGE_KEYS.API_KEY);
      const storedModel = await getStorageValue(STORAGE_KEYS.MODEL);
      if (storedKey) setApiKey(storedKey);
      if (storedModel) setModel(storedModel);
    } else {
      try {
        const settingsRes = await fetch("/api/user/settings");
        const { apiKey, googleApiKey, model } = await settingsRes.json();
        if (apiKey) setApiKey(apiKey);
        if (googleApiKey) setGoogleApiKey(googleApiKey);
        if (model) {
          setServerModel(model);
          setModel(model);
        }
      } catch (e) {
        console.error("Failed to load server settings", e);
      }
    }

    setIsLoading(false);
  }, [getStorageValue]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const save = async () => {
    setIsSaving(true);
    try {
      if (storageType === "client") {
        await setStorageValue(STORAGE_KEYS.API_KEY, apiKey);
        await setStorageValue(STORAGE_KEYS.MODEL, model);
        toast.success("Settings saved to your device");
      } else {
        const formData = new FormData();
        formData.append("openaiApiKey", apiKey);
        formData.append("aiModel", model);
        formData.append("googleApiKey", googleApiKey);

        const res = await fetch("/api/user/settings", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Save failed");
        }

        setServerModel(model);
        toast.success("Settings saved to server");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const filteredModels = models.filter((m) => {
    const hasOpenAI = Boolean(apiKey);
    const hasGoogle = Boolean(googleApiKey);
    return (
      (m.vendorId === "openai" && hasOpenAI) ||
      (m.vendorId === "google" && hasGoogle)
    );
  });

  return {
    apiKey,
    googleApiKey,
    model,
    serverModel,
    models: filteredModels,
    storageType,
    isSaving,
    setApiKey,
    setGoogleApiKey,
    setModel,
    setStorageType,
    save,
    isLoading,
  };
}
