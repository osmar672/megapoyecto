import type { SearchResult, UserRole } from "../types/domain";

export interface SearchContext {
  userId: string;
  role: UserRole;
}

export interface SearchProvider {
  id: string;
  search: (query: string, context: SearchContext) => SearchResult[];
}

interface SearchProviderModule {
  default: SearchProvider;
}

export class SearchProviderRegistry {
  private readonly providers = new Map<string, SearchProvider>();

  constructor(providers: SearchProvider[] = []) {
    providers.forEach((provider) => this.register(provider));
  }

  register(provider: SearchProvider): void {
    this.providers.set(provider.id, provider);
  }

  list(): SearchProvider[] {
    return [...this.providers.values()].sort((first, second) =>
      first.id.localeCompare(second.id),
    );
  }

  search(query: string, context: SearchContext): SearchResult[] {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];

    return this.list()
      .flatMap((provider) => provider.search(normalizedQuery, context))
      .filter((result) => result.allowedRoles.includes(context.role))
      .sort((first, second) => first.title.localeCompare(second.title));
  }
}

const modules = import.meta.glob<SearchProviderModule>(
  "../../features/**/searchProvider.ts",
  { eager: true },
);

export const searchProviderRegistry = new SearchProviderRegistry(
  Object.values(modules).map((module) => module.default),
);
