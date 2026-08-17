import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { CafeteriaProduct } from "../../../core/types/domain";

const favoritesKey = "schoolIntranet.v1.cafeteriaFavorites";

export const cafeteriaRepository = {
  list(query = "", category = "ALL"): CafeteriaProduct[] {
    const normalized = query.trim().toLocaleLowerCase("es");
    return localStorageService
      .get<CafeteriaProduct[]>(storageKeys.cafeteriaProducts, [])
      .value.filter((product) => {
        const matchesCategory = category === "ALL" || product.category === category;
        const matchesQuery = !normalized || `${product.name} ${product.description}`
          .toLocaleLowerCase("es")
          .includes(normalized);
        return matchesCategory && matchesQuery;
      });
  },

  favoriteIds(userId: string): string[] {
    return localStorageService.get<Record<string, string[]>>(favoritesKey, {}).value[userId] ?? [];
  },

  toggleFavorite(userId: string, productId: string): string[] {
    const all = localStorageService.get<Record<string, string[]>>(favoritesKey, {}).value;
    const current = new Set(all[userId] ?? []);
    if (current.has(productId)) current.delete(productId);
    else current.add(productId);
    const favorites = [...current];
    localStorageService.set(favoritesKey, { ...all, [userId]: favorites });
    return favorites;
  },
};
