"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { cafeteriaRepository } from "../services/cafeteriaRepository";

const availabilityLabels = { AVAILABLE: "Disponible", LIMITED: "Pocas unidades", UNAVAILABLE: "Agotado" } as const;

export function CafeteriaPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [favorites, setFavorites] = useState(() => user ? cafeteriaRepository.favoriteIds(user.id) : []);
  const categories = useMemo(() => [...new Set(cafeteriaRepository.list().map((product) => product.category))].sort(), []);
  if (!user) return null;
  const products = cafeteriaRepository.list(query, category);
  return <div className={styles.page}><FeatureHeader eyebrow="Servicios del campus" title="Soda y cafetería" description="Consulta productos, precios, categorías, disponibilidad y tus favoritos." /><div className={styles.toolbar}><label className={styles.field}>Buscar<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre del producto" /></label><label className={styles.field}>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="ALL">Todas</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label></div><section className={styles.grid}>{products.length === 0 ? <EmptyState>No hay productos para los filtros seleccionados.</EmptyState> : products.map((product) => { const favorite = favorites.includes(product.id); return <article key={product.id} className={styles.card}><div className={styles.cardTop}><StatusBadge tone={product.availability === "AVAILABLE" ? "success" : product.availability === "LIMITED" ? "warning" : "danger"}>{availabilityLabels[product.availability]}</StatusBadge><StatusBadge>{product.category}</StatusBadge></div><div role="img" aria-label={product.imageAlt} style={{ minHeight: "5rem", display: "grid", placeItems: "center", borderRadius: ".65rem", background: "var(--color-brand-soft)", color: "var(--color-brand-deep)", fontWeight: 800 }}>SODA</div><h2>{product.name}</h2><p>{product.description}</p><div className={styles.cardTop}><strong>₡{product.price.toLocaleString("es-CR")}</strong><button type="button" className={`${styles.button} ${styles.buttonSecondary}`} aria-pressed={favorite} onClick={() => setFavorites(cafeteriaRepository.toggleFavorite(user.id, product.id))}>{favorite ? "Quitar favorito" : "Agregar favorito"}</button></div></article>; })}</section></div>;
}
