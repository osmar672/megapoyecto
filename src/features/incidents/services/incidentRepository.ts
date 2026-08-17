import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { Incident, IncidentEvidence, User } from "../../../core/types/domain";
import { createId } from "../../../core/utils/createId";

function readAll(): Incident[] {
  return localStorageService.get<Incident[]>(storageKeys.incidents, []).value;
}

export const incidentRepository = {
  listVisible(user: User): Incident[] {
    return readAll()
      .filter((incident) => user.role === "ADMIN" || incident.reporterUserId === user.id)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  },

  validateEvidence(file: File): IncidentEvidence {
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024) {
      throw new Error("La evidencia debe ser PNG, JPEG o PDF y pesar máximo 2 MB.");
    }
    return { name: file.name, mimeType: file.type, size: file.size };
  },

  create(user: User, input: Pick<Incident, "type" | "description" | "location" | "occurredAt" | "priority"> & { evidence?: IncidentEvidence }): Incident {
    if (input.description.trim().length < 10 || !input.location.trim()) throw new Error("Completa una descripción detallada y el lugar.");
    const timestamp = new Date().toISOString();
    const incident: Incident = {
      id: createId("incident"),
      reporterUserId: user.id,
      type: input.type,
      description: input.description.trim(),
      location: input.location.trim(),
      occurredAt: input.occurredAt,
      priority: input.priority,
      status: "REPORTED",
      evidence: input.evidence ? [input.evidence] : [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    localStorageService.set(storageKeys.incidents, [...readAll(), incident]);
    return incident;
  },

  updateStatus(actor: User, id: string, status: Incident["status"]): Incident {
    if (actor.role !== "ADMIN") throw new Error("Solo Administración puede cambiar el estado.");
    const incidents = readAll();
    const index = incidents.findIndex((incident) => incident.id === id);
    const current = incidents[index];
    if (!current) throw new Error("La incidencia ya no existe.");
    const updated = { ...current, status, updatedAt: new Date().toISOString() };
    incidents[index] = updated;
    localStorageService.set(storageKeys.incidents, incidents);
    appEventBus.emit("incident:updated", { incident: updated });
    notificationService.create({
      userId: updated.reporterUserId,
      type: "INCIDENT",
      title: "Incidencia actualizada",
      message: `El estado cambió a ${status}.`,
      link: "/incidents",
    });
    return updated;
  },
};
