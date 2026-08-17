"use client";

import { useCallback, useSyncExternalStore } from "react";
import { appEventBus } from "../events/appEventBus";
import { notificationService } from "./notificationService";

export function useUnreadNotificationCount(userId?: string): number {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (!userId) return () => undefined;

    const unsubscribeCreated = appEventBus.on("notification:created", ({ notification }) => {
      if (notification.userId === userId) onStoreChange();
    });
    const unsubscribeChanged = appEventBus.on("notification:changed", (event) => {
      if (event.userId === userId) onStoreChange();
    });

    return () => {
      unsubscribeCreated();
      unsubscribeChanged();
    };
  }, [userId]);

  const getSnapshot = useCallback(
    () => userId ? notificationService.getUnreadCount(userId) : 0,
    [userId],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
