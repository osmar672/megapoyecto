import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { userRepository } from "../features/users/services/userRepository";
import { getDashboardMetrics } from "../features/auth/services/dashboardService";
import { scheduleRepository } from "../features/schedules/services/scheduleRepository";
import { timelineRepository } from "../features/timeline/services/timelineRepository";

describe("indicadores y próximos eventos", () => {
  beforeEach(async () => {
    await initializeSeedData();
  });

  it("muestra indicadores operativos para el personal", () => {
    const staff = userRepository.findById("usr_staff_001");
    expect(staff).toBeDefined();

    expect(getDashboardMetrics(staff!).map((metric) => metric.label)).toEqual([
      "Mis incidencias abiertas",
      "Avisos de emergencia",
      "Buses operativos",
    ]);
  });

  it("omite actividades pasadas en el widget temporal", () => {
    expect(
      timelineRepository.findNext("ADMIN", new Date("2026-08-18T07:59:00-06:00"))?.id,
    ).toBe("evt_002");
    expect(timelineRepository.findNext("ADMIN", new Date("2100-01-01T00:00:00Z"))).toBeUndefined();
  });

  it("elige la siguiente clase por hora y vuelve al lunes al terminar la semana", () => {
    const teacher = userRepository.findById("usr_teacher_001");
    expect(teacher).toBeDefined();

    expect(
      scheduleRepository.findNextForUser(teacher!, new Date(2026, 7, 17, 8, 30))?.startTime,
    ).toBe("08:40");
    expect(
      scheduleRepository.findNextForUser(teacher!, new Date(2026, 7, 21, 11, 0))?.dayOfWeek,
    ).toBe(1);
  });
});
