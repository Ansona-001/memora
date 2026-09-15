import { useCallback, useEffect, useState } from "react";

import { AI_CONFIG, isAiEnabledPreference } from "@/features/ai/config/aiConfig";

interface StoredPreference {
  enabled: boolean;
}

function readPreference(): StoredPreference {
  if (typeof localStorage === "undefined") {
    return { enabled: AI_CONFIG.enabledByDefault };
  }

  try {
    return {
      enabled: isAiEnabledPreference(
        localStorage.getItem(AI_CONFIG.storageKey),
      ),
    };
  } catch {
    return { enabled: AI_CONFIG.enabledByDefault };
  }
}

export function useAiPreference() {
  const [enabled, setEnabled] = useState<boolean>(
    () => readPreference().enabled,
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === AI_CONFIG.storageKey) {
        setEnabled(isAiEnabledPreference(event.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((next: boolean) => {
    setEnabled(next);
    try {
      localStorage.setItem(AI_CONFIG.storageKey, String(next));
    } catch {
      /* private mode: keep in-memory only */
    }
  }, []);

  return { aiEnabled: enabled, setAiEnabled: update };
}
