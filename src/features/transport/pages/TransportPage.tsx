"use client";

import { useMemo, useState } from "react";
import type { Bus } from "../../../core/types/domain";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { useTransportSimulation } from "../hooks/useTransportSimulation";
import { transportRepository } from "../services/transportRepository";

const statusLabels: Record<Bus["status"], string> = { ON_TIME: "En ruta", DELAYED: "Retrasado", OUT_OF_SERVICE: "Fuera de servicio", FINISHED: "Finalizado" };

export function TransportPage() {
  const buses = useTransportSimulation();
  const routesById = useMemo(
    () => new Map(transportRepository.listRoutes().map((route) => [route.id, route])),
    [],
  );

  return (
    <div className={styles.page}>
      <FeatureHeader eyebrow="Movilidad escolar" title="Transporte y buses" description="Posición demostrativa, próxima parada, hora estimada y estado operativo de cada unidad." />
      <div className={styles.split}>
        <section className={styles.map} aria-label="Mapa simulado de buses">
          {buses.map((bus) => <div key={bus.id} className={styles.mapPin} style={{ left: `${bus.position.x}%`, top: `${bus.position.y}%` }} aria-label={`Bus ${bus.number}: ${statusLabels[bus.status]}`}>{bus.number}</div>)}
        </section>
        <aside className={styles.card}><h2>Información accesible</h2><p>El mapa es una simulación visual. La lista siguiente contiene la misma información en texto y se actualiza automáticamente.</p><p>Si activas la reducción de movimiento en el sistema, los datos permanecen disponibles aunque el desplazamiento visual se reduzca.</p></aside>
      </div>
      <section className={styles.grid} aria-live="polite">
        {buses.length === 0 ? <EmptyState>No hay buses registrados.</EmptyState> : buses.map((bus) => {
          const route = routesById.get(bus.routeId);
          return <article className={styles.card} key={bus.id}><div className={styles.cardTop}><StatusBadge tone={bus.status === "DELAYED" ? "warning" : bus.status === "OUT_OF_SERVICE" ? "danger" : "success"}>{statusLabels[bus.status]}</StatusBadge><strong>Bus {bus.number}</strong></div><h2>{route?.name ?? "Ruta no asignada"}</h2><p>Conductor: {bus.driverName}</p><div className={styles.meta}><span>Próxima parada: {bus.nextStop}</span><span>Estimado: {bus.estimatedArrival}</span></div></article>;
        })}
      </section>
    </div>
  );
}

export function BusSchedulesPage() {
  const [routes] = useState(() => transportRepository.listRoutes());
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => routes.filter((route) => `${route.name} ${route.stops.map((stop) => stop.name).join(" ")}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))), [query, routes]);
  return <div className={styles.page}><FeatureHeader eyebrow="Movilidad escolar" title="Horarios de buses" description="Consulta salida, paradas, llegada y turno de las rutas institucionales." /><div className={styles.toolbar}><label className={styles.field}>Buscar ruta<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ruta o parada" /></label></div><section className={styles.gridTwo}>{filtered.length === 0 ? <EmptyState>No hay rutas coincidentes.</EmptyState> : filtered.map((route) => <article key={route.id} className={styles.card}><div className={styles.cardTop}><h2>{route.name}</h2><StatusBadge tone="info">{route.shift === "MORNING" ? "Mañana" : "Tarde"}</StatusBadge></div><p>Salida {route.departureTime} · Llegada {route.arrivalTime}</p><ol>{route.stops.map((stop) => <li key={stop.id}><strong>{stop.scheduledTime}</strong> · {stop.name}</li>)}</ol></article>)}</section></div>;
}
