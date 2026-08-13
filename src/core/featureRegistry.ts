import type { FeatureModule } from "./types/feature";

interface FeatureImport {
  default: FeatureModule;
}

const modules = import.meta.glob<FeatureImport>("../features/**/feature.tsx", {
  eager: true,
});

export const featureModules = Object.values(modules)
  .map((module) => module.default)
  .sort((first, second) => first.id.localeCompare(second.id));

export const registeredRoutes = featureModules.flatMap((module) => module.routes);

export const registeredNavigation = featureModules
  .flatMap((module) => module.navigation)
  .sort((first, second) => first.order - second.order);
