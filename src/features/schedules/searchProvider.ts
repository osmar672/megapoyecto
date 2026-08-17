import type { SearchProvider } from "../../core/search/searchProviderRegistry";
import { scheduleRepository } from "./services/scheduleRepository";

const provider: SearchProvider = {
  id: "schedules",
  search(query, context) {
    const normalized = query.toLocaleLowerCase("es");
    return scheduleRepository
      .listForUser({
        id: context.userId,
        role: context.role,
        relatedStudentId: context.relatedStudentId,
      })
      .filter((entry) => `${entry.subject} ${entry.teacherName} ${entry.location}`
        .toLocaleLowerCase("es")
        .includes(normalized))
      .map((entry) => ({
        id: entry.id,
        category: "SCHEDULES",
        title: entry.subject,
        description: `${entry.startTime} · ${entry.location}`,
        path: "/schedules",
        keywords: [entry.teacherName],
        allowedRoles: [context.role],
        source: "schedules",
      }));
  },
};

export default provider;
