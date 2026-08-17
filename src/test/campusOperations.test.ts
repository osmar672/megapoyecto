import { beforeEach, describe, expect, it, vi } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { appEventBus } from "../core/events/appEventBus";
import { searchProviderRegistry } from "../core/search/searchProviderRegistry";
import { localStorageService } from "../core/storage/storageService";
import { storageKeys } from "../core/storage/storageKeys";
import { cafeteriaRepository } from "../features/cafeteria/services/cafeteriaRepository";
import { campusMapRepository } from "../features/campus-map/services/campusMapRepository";
import { emergencyRepository } from "../features/emergencies/services/emergencyRepository";
import { incidentRepository } from "../features/incidents/services/incidentRepository";
import { scheduleRepository } from "../features/schedules/services/scheduleRepository";
import { timelineRepository } from "../features/timeline/services/timelineRepository";
import { transportRepository } from "../features/transport/services/transportRepository";
import type { ScheduleEntry, User } from "../core/types/domain";

const admin: User = { id: "usr_admin_001", firstName: "Elena", lastName: "Mora", email: "admin@colegiohorizonte.edu.cr", role: "ADMIN", isActive: true, createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };
const otherTeacher: User = { id: "usr_teacher_other", firstName: "Laura", lastName: "Jiménez", email: "laura@colegiohorizonte.edu.cr", role: "TEACHER", isActive: true, createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };
const family: User = { id: "usr_family_001", firstName: "Daniela", lastName: "Rojas", email: "familia@colegiohorizonte.edu.cr", role: "STUDENT_FAMILY", isActive: true, relatedStudentId: "stu_001", createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };

describe("operaciones del campus", () => {
  beforeEach(async () => { appEventBus.clear(); await initializeSeedData(); });

  it("filtra la línea de tiempo por período y audiencia", () => {
    expect(timelineRepository.listInRange("STUDENT_FAMILY", "WEEK", new Date("2026-08-17T06:00:00-06:00"))).toHaveLength(4);
    expect(timelineRepository.list("STAFF")[0]?.id).toBe("evt_001");
  });

  it("encuentra ubicaciones por nombre y términos alternativos", () => {
    expect(campusMapRepository.search("libros")[0]?.name).toBe("Biblioteca");
    expect(campusMapRepository.search("laboratorio", "LAB")).toHaveLength(2);
  });

  it("simula buses y emite sus actualizaciones", () => {
    const listener = vi.fn();
    appEventBus.on("bus:updated", listener);
    const before = transportRepository.listBuses()[0];
    const after = transportRepository.advanceSimulation()[0];
    expect(after?.position).not.toEqual(before?.position);
    expect(listener).toHaveBeenCalled();
  });

  it("busca productos y conserva favoritos por usuario", () => {
    expect(cafeteriaRepository.list("jugo")).toHaveLength(1);
    expect(cafeteriaRepository.toggleFavorite(family.id, "product_01")).toEqual(["product_01"]);
    expect(cafeteriaRepository.toggleFavorite(family.id, "product_01")).toEqual([]);
  });

  it("protege cambios de horario y notifica a la familia", () => {
    const entry = scheduleRepository.listForUser(family)[0];
    expect(entry).toBeDefined();
    expect(() => scheduleRepository.update(family, { ...entry!, startTime: "08:00" })).toThrow("permisos");
    expect(() => scheduleRepository.update(otherTeacher, { ...entry!, startTime: "08:00" })).toThrow("este horario");
    expect(() => scheduleRepository.update(admin, { ...entry!, startTime: "10:00", endTime: "09:00" })).toThrow("posterior");
    const tamperedEntry = { ...entry!, subject: "Materia alterada", startTime: "08:00" };
    const updated = scheduleRepository.update(admin, tamperedEntry);
    expect(updated.startTime).toBe("08:00");
    expect(updated.subject).toBe(entry!.subject);
  });

  it("limita la búsqueda de horarios al estudiante relacionado", () => {
    const entries = localStorageService.get<ScheduleEntry[]>(storageKeys.scheduleEntries, []).value;
    localStorageService.set(storageKeys.scheduleEntries, [...entries, {
      id: "schedule_private",
      userId: "usr_teacher_other",
      studentId: "stu_002",
      dayOfWeek: 1,
      startTime: "11:00",
      endTime: "12:00",
      subject: "Materia privada",
      teacherName: "Laura Jiménez",
      location: "Aula 9-2",
      type: "CLASS",
      updatedAt: "2026-08-17T00:00:00.000Z",
    }]);

    expect(searchProviderRegistry.search("Materia privada", {
      userId: family.id,
      role: family.role,
      relatedStudentId: family.relatedStudentId,
    })).toEqual([]);
    expect(searchProviderRegistry.search("Materia privada", {
      userId: admin.id,
      role: admin.role,
    })).toHaveLength(1);
  });

  it("permite administrar emergencias solo a roles autorizados", () => {
    expect(() => emergencyRepository.publish(family, { title: "Prueba", body: "Mensaje de prueba", kind: "WARNING" })).toThrow("permisos");
    const published = emergencyRepository.publish(admin, { title: "Precaución", body: "Evita el edificio B.", kind: "WARNING" });
    expect(published.status).toBe("ACTIVE");
    expect(emergencyRepository.resolve(admin, published.id).status).toBe("RESOLVED");
  });

  it("conserva el contenido de una evidencia válida", async () => {
    const evidence = await incidentRepository.prepareEvidence(
      new File(["evidencia de prueba"], "evidencia.pdf", { type: "application/pdf" }),
    );

    expect(evidence.name).toBe("evidencia.pdf");
    expect(evidence.dataUrl).toMatch(/^data:application\/pdf;base64,/);
  });
});
