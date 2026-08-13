import { beforeEach, describe, expect, it } from "vitest";
import type { AuthSession } from "../core/types/domain";
import { initializeSeedData } from "../core/data/seedService";
import { announcementRepository } from "../features/announcements/services/announcementRepository";

const session = (role: AuthSession["role"], userId: string): AuthSession => ({
  userId,
  role,
  issuedAt: "2026-08-13T12:00:00.000Z",
  expiresAt: "2026-08-13T20:00:00.000Z",
});

describe("announcementRepository", () => {
  beforeEach(async () => initializeSeedData());

  it("muestra a la familia solo publicaciones dirigidas a su perfil", () => {
    const visible = announcementRepository.listVisible(session("STUDENT_FAMILY", "usr_family_001"));
    expect(visible).toHaveLength(2);
    expect(visible.every((item) => item.status === "PUBLISHED")).toBe(true);
  });

  it("permite a un docente crear y editar su borrador, pero no publicarlo", () => {
    const teacher = session("TEACHER", "usr_teacher_001");
    const draft = announcementRepository.save(teacher, {
      title: "Material de repaso",
      body: "El material de repaso ya está disponible para el grupo.",
      audience: "STUDENT_FAMILY",
    });
    expect(announcementRepository.save(teacher, { ...draft, title: "Material actualizado" }, draft.id).title).toBe("Material actualizado");
    expect(() => announcementRepository.publish(teacher, draft.id)).toThrow("Solo Administración");
  });
});
