import type { NavigationItem, SearchProvider, WidgetDefinition } from "./types";

export function navigationRegistry(items: NavigationItem[]) { return [...items].sort((a,b)=>a.order-b.order); }
export function widgetRegistry(items: WidgetDefinition[]) { return [...items].sort((a,b)=>a.order-b.order); }
export function searchRegistry(providers: SearchProvider[], query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];
  return providers.flatMap((provider)=>provider.search(normalized));
}
