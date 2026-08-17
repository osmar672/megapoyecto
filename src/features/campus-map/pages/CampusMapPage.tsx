"use client";

import { useMemo, useState } from "react";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { campusMapRepository } from "../services/campusMapRepository";

export function CampusMapPage() {
  const locations = campusMapRepository.list();
  const types = useMemo(() => [...new Set(locations.map((location) => location.type))].sort(), [locations]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");
  const filtered = campusMapRepository.search(query, type);
  const selected = locations.find((location) => location.id === selectedId);

  return (
    <div className={styles.page}>
      <FeatureHeader eyebrow="Orientación" title="Mapa del campus" description="Busca aulas y servicios, selecciona una ubicación y consulta una descripción textual equivalente." />
      <div className={styles.toolbar}>
        <label className={styles.field}>¿Dónde queda...?<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Biblioteca, soda, laboratorio..." /></label>
        <label className={styles.field}>Tipo<select value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">Todos</option>{types.map((value) => <option key={value}>{value}</option>)}</select></label>
      </div>
      <div className={styles.split}>
        <section className={styles.map} aria-label="Representación visual del campus">
          {filtered.map((location) => <button key={location.id} type="button" className={styles.mapPin} style={{ left: `${location.x}%`, top: `${location.y}%` }} aria-label={location.name} aria-pressed={selectedId === location.id} onClick={() => setSelectedId(location.id)}>{location.name.slice(0, 2).toUpperCase()}</button>)}
        </section>
        <aside className={styles.card} aria-live="polite">
          {selected ? <><div className={styles.cardTop}><StatusBadge tone="info">{selected.type}</StatusBadge>{selected.isAccessible && <StatusBadge tone="success">Accesible</StatusBadge>}</div><h2>{selected.name}</h2><p>{selected.description}</p><p><strong>Ubicación relativa:</strong> {selected.x}% horizontal, {selected.y}% vertical.</p></> : <EmptyState>Selecciona una ubicación del mapa.</EmptyState>}
        </aside>
      </div>
      <section className={styles.card} aria-labelledby="location-list-title"><h2 id="location-list-title">Descripción textual del mapa</h2><div className={styles.grid}>{filtered.map((location) => <button key={location.id} type="button" className={`${styles.card} ${styles.buttonSecondary}`} onClick={() => setSelectedId(location.id)}><strong>{location.name}</strong><span>{location.description}</span></button>)}</div></section>
    </div>
  );
}
