import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { academicRepository } from "../features/academics/services/academicRepository";
import { authService } from "../features/auth/services/authService";

describe("academicRepository", () => {
  beforeEach(async () => initializeSeedData());

  it("restringe la vista familiar al estudiante relacionado", async () => {
    const family = await authService.login("familia@colegiohorizonte.edu.cr", "Familia2026!");
    const view = academicRepository.getView(family);
    expect(view.students.map((student) => student.id)).toEqual(["stu_001"]);
    expect(view.grades.every((grade) => grade.studentId === "stu_001")).toBe(true);
    expect(view.attendance.every((record) => record.studentId === "stu_001")).toBe(true);
  });

  it("permite al docente actualizar una calificación de su curso", async () => {
    const teacher = await authService.login("docente@colegiohorizonte.edu.cr", "Docente2026!");
    const grade = academicRepository.saveGrade(teacher, {
      studentId: "stu_001",
      courseId: "crs_math_001",
      period: "I trimestre",
      score: 95,
      maxScore: 100,
    });
    expect(grade.id).toBe("grd_001");
    expect(grade.score).toBe(95);
  });

  it("impide que una familia escriba datos académicos", async () => {
    const family = await authService.login("familia@colegiohorizonte.edu.cr", "Familia2026!");
    expect(() => academicRepository.saveAttendance(family, {
      studentId: "stu_001",
      courseId: "crs_math_001",
      date: "2026-08-13",
      status: "PRESENT",
    })).toThrow("solo puede consultar");
  });

  it("impide que personal administrativo escriba datos académicos", async () => {
    const staff = await authService.login("personal@colegiohorizonte.edu.cr", "Personal2026!");
    expect(() => academicRepository.saveGrade(staff, {
      studentId: "stu_001",
      courseId: "crs_math_001",
      period: "II trimestre",
      score: 90,
      maxScore: 100,
    })).toThrow("solo puede consultar");
  });
});
