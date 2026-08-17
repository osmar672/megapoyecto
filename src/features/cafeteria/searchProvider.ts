import type { SearchProvider } from "../../core/search/searchProviderRegistry"; import { cafeteriaRepository } from "./services/cafeteriaRepository";
const provider: SearchProvider = { id: "cafeteria", search(query, context) { return cafeteriaRepository.list(query).map((product) => ({ id: product.id, category: "PRODUCTS", title: product.name, description: `₡${product.price.toLocaleString("es-CR")} · ${product.availability}`, path: "/cafeteria", keywords: [product.category], allowedRoles: [context.role], source: "cafeteria" })); } };
export default provider;
