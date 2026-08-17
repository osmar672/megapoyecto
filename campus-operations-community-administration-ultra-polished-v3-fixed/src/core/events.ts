type EventMap = { "emergency:changed": { id?: string; notice?: unknown }; "transport:changed": { id?: string }; "cafeteria:changed": { id?: string }; "schedule:changed": { id?: string; entry?: unknown }; };
type Listener<K extends keyof EventMap> = (payload: EventMap[K]) => void;
const listeners = new Map<keyof EventMap, Set<Listener<any>>>();
export const eventBus = {
  on<K extends keyof EventMap>(event:K, listener:Listener<K>) { const set=listeners.get(event) ?? new Set(); set.add(listener); listeners.set(event,set); return ()=>set.delete(listener); },
  emit<K extends keyof EventMap>(event:K, payload:EventMap[K]) { listeners.get(event)?.forEach((listener)=>listener(payload)); },
};
