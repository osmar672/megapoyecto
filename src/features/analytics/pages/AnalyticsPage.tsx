"use client";

import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { FeatureHeader, featureStyles as styles } from "../../shared/FeaturePage";
import { analyticsService, type RegistrationMetric } from "../services/analyticsService";

type PeriodKey = Exclude<keyof RegistrationMetric, "period" | "dropout">;

export function AnalyticsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodKey>("month");
  if (!user) return null;
  const data = analyticsService.registrations();
  const levels = analyticsService.dropoutByLevel();
  const max = Math.max(...data.map((item) => item[period]), 1);
  const total = data.reduce((sum, item) => sum + item[period], 0);
  return <div className={styles.page}><FeatureHeader eyebrow="Supervisión institucional" title="Estadísticas administrativas" description="Métricas ficticias de registros y abandono con una tabla equivalente y controles accesibles." /><div className={styles.toolbar}><label className={styles.field}>Período<select value={period} onChange={(event) => setPeriod(event.target.value as PeriodKey)}><option value="today">Hoy</option><option value="week">Semana</option><option value="month">Mes</option><option value="year">Año</option></select></label></div><div className={styles.metrics}><article className={styles.metric}><span>Registros del período</span><strong>{total}</strong></article><article className={styles.metric}><span>Abandono acumulado</span><strong>{data.reduce((sum, item) => sum + item.dropout, 0)}</strong></article><article className={styles.metric}><span>Niveles analizados</span><strong>{levels.length}</strong></article><article className={styles.metric}><span>Último mes</span><strong>{data.at(-1)?.period}</strong></article></div><div className={styles.gridTwo}><section className={styles.card}><h2>Nuevos registros</h2>{data.map((item) => <div key={item.period}><div className={styles.cardTop}><span>{item.period}</span><strong>{item[period]}</strong></div><div className={styles.progress} role="progressbar" aria-label={`${item.period}: ${item[period]}`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={item[period]}><span style={{ width: `${item[period] * 100 / max}%` }} /></div></div>)}</section><section className={styles.card}><h2>Abandono por nivel</h2>{levels.map((item) => <div key={item.level}><div className={styles.cardTop}><span>{item.level}</span><strong>{item.value}</strong></div><div className={styles.progress} role="progressbar" aria-label={`${item.level}: ${item.value}`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={item.value}><span style={{ width: `${item.value * 10}%` }} /></div></div>)}</section></div><section className={styles.tableWrap} aria-label="Tabla equivalente de estadísticas"><table className={styles.table}><caption>Registros y abandono por mes</caption><thead><tr><th>Mes</th><th>Hoy</th><th>Semana</th><th>Mes</th><th>Año</th><th>Abandono</th></tr></thead><tbody>{data.map((item) => <tr key={item.period}><td>{item.period}</td><td>{item.today}</td><td>{item.week}</td><td>{item.month}</td><td>{item.year}</td><td>{item.dropout}</td></tr>)}</tbody></table></section></div>;
}
