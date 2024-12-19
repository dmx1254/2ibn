"use client";

import { useEffect, useCallback } from "react";
import axios from "axios";

interface PresenceOptions {
  userId: string | undefined;
  heartbeatInterval?: number;
  onError?: (error: any) => void;
}

export const useUserPresence = ({
  userId,
  heartbeatInterval = 120000,
  onError = (error: any) => console.error("Erreur de présence:", error),
}: PresenceOptions) => {
  const updatePresence = useCallback(
    async (online: boolean) => {
      try {
        await axios.post("/api/users-status-changed", {
          userId,
          online,
        });
      } catch (error) {
        onError(error);
      }
    },
    [userId, onError]
  );

  useEffect(() => {
    updatePresence(true);
    const interval = setInterval(() => updatePresence(true), heartbeatInterval);

    const handleVisibilityChange = () => {
      updatePresence(document.visibilityState === "visible");
    };

    const handleBeforeUnload = () => {
      const data = JSON.stringify({ userId, online: false });
      navigator.sendBeacon("/api/users-status-changed", data);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updatePresence(false);
    };
  }, [updatePresence, heartbeatInterval, userId]);

  return { updatePresence };
};