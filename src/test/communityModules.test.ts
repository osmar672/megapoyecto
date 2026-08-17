import { beforeEach, describe, expect, it, vi } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { appEventBus } from "../core/events/appEventBus";
import { notificationService } from "../core/notifications/notificationService";
import type { User } from "../core/types/domain";
import { achievementRepository } from "../features/achievements/services/achievementRepository";
import { forumRepository } from "../features/forum/services/forumRepository";
import { incidentRepository } from "../features/incidents/services/incidentRepository";

const admin: User = { id: "usr_admin_001", firstName: "Elena", lastName: "Mora", email: "admin@colegiohorizonte.edu.cr", role: "ADMIN", isActive: true, createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };
const teacher: User = { id: "usr_teacher_001", firstName: "Mauricio", lastName: "Vargas", email: "docente@colegiohorizonte.edu.cr", role: "TEACHER", isActive: true, createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };
const family: User = { id: "usr_family_001", firstName: "Daniela", lastName: "Rojas", email: "familia@colegiohorizonte.edu.cr", role: "STUDENT_FAMILY", isActive: true, relatedStudentId: "stu_001", createdAt: "2026-08-17T00:00:00.000Z", updatedAt: "2026-08-17T00:00:00.000Z" };

describe("comunidad y supervisión", () => {
  beforeEach(async () => { appEventBus.clear(); await initializeSeedData(); });

  it("crea, comenta, reacciona, reporta y modera publicaciones", () => {
    const post = forumRepository.create(teacher, { title: "Tutoría", body: "Sesión de apoyo el viernes.", category: "Académico" });
    expect(forumRepository.addComment(family, post.id, "Gracias por avisar.").postId).toBe(post.id);
    expect(forumRepository.toggleReaction(family, post.id).reactionUserIds).toContain(family.id);
    expect(forumRepository.report(post.id).reportCount).toBe(1);
    expect(() => forumRepository.moderate(teacher, post.id, "HIDDEN")).toThrow("Administración");
    expect(forumRepository.moderate(admin, post.id, "HIDDEN").status).toBe("HIDDEN");
    expect(notificationService.getUnreadCount(teacher.id)).toBe(1);
  });

  it("protege privacidad y cambios de estado de incidencias", () => {
    const created = incidentRepository.create(teacher, { type: "Aula", description: "La luminaria del aula no funciona.", location: "Aula 9-1", occurredAt: "2026-08-17T12:00:00.000Z", priority: "MEDIUM" });
    expect(incidentRepository.listVisible(family).some((incident) => incident.id === created.id)).toBe(false);
    expect(() => incidentRepository.updateStatus(teacher, created.id, "IN_REVIEW")).toThrow("Administración");
    const listener = vi.fn();
    appEventBus.on("incident:updated", listener);
    expect(incidentRepository.updateStatus(admin, created.id, "RESOLVED").status).toBe("RESOLVED");
    expect(listener).toHaveBeenCalled();
  });

  it("valida tipo y tamaño de evidencia", () => {
    expect(() => incidentRepository.validateEvidence(new File(["texto"], "evidencia.txt", { type: "text/plain" }))).toThrow("PNG");
    expect(incidentRepository.validateEvidence(new File(["imagen"], "evidencia.png", { type: "image/png" })).mimeType).toBe("image/png");
  });

  it("desbloquea logros completos y genera notificación", () => {
    const achievement = achievementRepository.listForUser(family).find((item) => item.id === "ach_01");
    expect(achievement).toBeDefined();
    expect(() => achievementRepository.unlock(family, achievement!.id)).toThrow("Administración");
    expect(achievementRepository.unlock(admin, achievement!.id).unlockedAt).toBeTruthy();
    expect(notificationService.getUnreadCount(family.id)).toBe(1);
  });
});
