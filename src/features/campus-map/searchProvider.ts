import type { SearchProvider } from "../../core/search/searchProviderRegistry";
import { campusMapRepository } from "./services/campusMapRepository";
const provider: SearchProvider = { id: "campus-map", search(query, context) { return campusMapRepository.search(query).map((location) => ({ id: location.id, category: "PLACES", title: location.name, description: location.description, path: "/campus-map", keywords: location.searchTerms, allowedRoles: [context.role], source: "campus-map" })); } };
export default provider;
