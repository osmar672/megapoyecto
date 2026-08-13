import type {
  Achievement,
  Announcement,
  Bus,
  EmergencyNotice,
  Incident,
  Notification,
  ScheduleEntry,
} from "../types/domain";

export interface AppEventMap {
  "announcement:published": { announcement: Announcement };
  "incident:updated": { incident: Incident };
  "schedule:changed": { entry: ScheduleEntry };
  "achievement:unlocked": { achievement: Achievement };
  "bus:updated": { bus: Bus };
  "emergency:changed": { notice: EmergencyNotice };
  "notification:created": { notification: Notification };
}

export type AppEventName = keyof AppEventMap;
export type AppEventListener<EventName extends AppEventName> = (
  payload: AppEventMap[EventName],
) => void;

type AnyAppEvent = AppEventMap[AppEventName];
type AnyAppEventListener = (payload: AnyAppEvent) => void;

export class AppEventBus {
  private readonly listeners = new Map<AppEventName, Set<AnyAppEventListener>>();

  on<EventName extends AppEventName>(
    eventName: EventName,
    listener: AppEventListener<EventName>,
  ): () => void {
    const eventListeners = this.listeners.get(eventName) ?? new Set<AnyAppEventListener>();
    eventListeners.add(listener as AnyAppEventListener);
    this.listeners.set(eventName, eventListeners);
    return () => this.off(eventName, listener);
  }

  off<EventName extends AppEventName>(
    eventName: EventName,
    listener: AppEventListener<EventName>,
  ): void {
    const eventListeners = this.listeners.get(eventName);
    eventListeners?.delete(listener as AnyAppEventListener);
    if (eventListeners?.size === 0) this.listeners.delete(eventName);
  }

  emit<EventName extends AppEventName>(
    eventName: EventName,
    payload: AppEventMap[EventName],
  ): void {
    const eventListeners = this.listeners.get(eventName);
    if (!eventListeners) return;
    [...eventListeners].forEach((listener) => listener(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const appEventBus = new AppEventBus();
