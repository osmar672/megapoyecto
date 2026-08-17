export interface RegistrationMetric {
  period: string;
  today: number;
  week: number;
  month: number;
  year: number;
  dropout: number;
}

const registrationMetrics: RegistrationMetric[] = [
  { period: "Enero", today: 2, week: 14, month: 52, year: 52, dropout: 3 },
  { period: "Febrero", today: 1, week: 10, month: 41, year: 93, dropout: 2 },
  { period: "Marzo", today: 3, week: 12, month: 38, year: 131, dropout: 4 },
  { period: "Abril", today: 0, week: 7, month: 22, year: 153, dropout: 2 },
  { period: "Mayo", today: 1, week: 8, month: 29, year: 182, dropout: 5 },
  { period: "Junio", today: 2, week: 9, month: 31, year: 213, dropout: 3 },
  { period: "Julio", today: 4, week: 18, month: 47, year: 260, dropout: 2 },
  { period: "Agosto", today: 5, week: 21, month: 56, year: 316, dropout: 1 },
];

export const analyticsService = {
  registrations(): RegistrationMetric[] {
    return registrationMetrics;
  },
  dropoutByLevel(): Array<{ level: string; value: number }> {
    return [
      { level: "Sétimo", value: 7 },
      { level: "Octavo", value: 5 },
      { level: "Noveno", value: 4 },
      { level: "Décimo", value: 3 },
      { level: "Undécimo", value: 2 },
    ];
  },
};
