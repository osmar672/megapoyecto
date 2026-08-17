import type { SearchProvider } from "../../core/search/searchProviderRegistry";
import { localStorageService } from "../../core/storage/storageService";
import { storageKeys } from "../../core/storage/storageKeys";
import type { Announcement } from "../../core/types/domain";

const provider: SearchProvider = {
  id: "announcements",
  search(query, context) {
    const normalized = query.toLocaleLowerCase("es");
    return localStorageService.get<Announcement[]>(storageKeys.announcements, []).value
      .filter((announcement) => announcement.status === "PUBLISHED" && (announcement.audience === "ALL" || announcement.audience === context.role) && `${announcement.title} ${announcement.body}`.toLocaleLowerCase("es").includes(normalized))
      .map((announcement) => ({ id: announcement.id, category: "ANNOUNCEMENTS", title: announcement.title, description: announcement.body, path: "/announcements", keywords: [announcement.audience], allowedRoles: [context.role], source: "announcements" }));
  },
};
export default provider;
