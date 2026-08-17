import type { SearchProvider } from "../../core/search/searchProviderRegistry";
import { timelineRepository } from "./services/timelineRepository";

const provider: SearchProvider = {
  id: "timeline",
  search(query, context) {
    const normalized = query.toLocaleLowerCase("es");
    return timelineRepository.list(context.role)
      .filter((event) => `${event.title} ${event.description} ${event.location ?? ""}`.toLocaleLowerCase("es").includes(normalized))
      .map((event) => ({ id: event.id, category: "EVENTS", title: event.title, description: event.description, path: "/timeline", keywords: [event.type, event.location ?? ""], allowedRoles: [context.role], source: "timeline" }));
  },
};
export default provider;
