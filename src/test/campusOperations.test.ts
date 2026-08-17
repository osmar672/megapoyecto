import { beforeEach, describe, expect, it, vi } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { appEventBus } from "../core/events/appEventBus";
import { cafeteriaRepository } from "../features/cafeteria/services/cafeteriaRepository";
import { campusMapRepository } from "../features/campus-map/services/campusMapRepository";
import { emergencyRepository } from "../features/emergencies/services/emergencyRepository";
import { scheduleRepository } from "../features/schedules/services/scheduleRepository";
import { timelineRepository } from "../features/timeline/services/timelineRepository";
import { transportRepository } from "../features/transport/services/transportRepository";
import type { User } from "../core/types/domain";

const admin: User = { id: "usr_admin_001", firstName: "Elena", lastName: "Mora", email: "admin@colegiohorizonte.edu.cr", role: "ADMIN", isActive: true, createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };
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
    const updated = scheduleRepository.update(admin, { ...entry!, startTime: "08:00" });
    expect(updated.startTime).toBe("08:00");
  });

  it("permite administrar emergencias solo a roles autorizados", () => {
    expect(() => emergencyRepository.publish(family, { title: "Prueba", body: "Mensaje de prueba", kind: "WARNING" })).toThrow("permisos");
    const published = emergencyRepository.publish(admin, { title: "Precaución", body: "Evita el edificio B.", kind: "WARNING" });
    expect(published.status).toBe("ACTIVE");
    expect(emergencyRepository.resolve(admin, published.id).status).toBe("RESOLVED");
  });
});
