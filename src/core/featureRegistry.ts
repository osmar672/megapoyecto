import type { FeatureModule } from "./types/feature";

const modules = import.meta.glob("../features/**/feature.tsx", {
  eager: true,
  import: "default",
}) as Record<string, FeatureModule>;

export const featureModules = Object.values(modules)
  .sort((first, second) => first.id.localeCompare(second.id));

export const registeredRoutes = featureModules.flatMap((module) => module.routes);

export const registeredNavigation = featureModules
  .flatMap((module) => module.navigation)
  .sort((first, second) => first.order - second.order);
