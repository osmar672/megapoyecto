import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { CampusLocation } from "../../../core/types/domain";

export const campusMapRepository = {
  list(): CampusLocation[] {
    return localStorageService
      .get<CampusLocation[]>(storageKeys.campusLocations, [])
      .value.sort((first, second) => first.name.localeCompare(second.name, "es"));
  },

  search(query: string, type = "ALL"): CampusLocation[] {
    const normalized = query.trim().toLocaleLowerCase("es");
    return this.list().filter((location) => {
      const matchesType = type === "ALL" || location.type === type;
      const searchable = [location.name, location.description, ...location.searchTerms]
        .join(" ")
        .toLocaleLowerCase("es");
      return matchesType && (!normalized || searchable.includes(normalized));
    });
  },
};
