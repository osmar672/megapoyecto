import type { ComponentType } from "react";
import type { UserRole } from "./domain";

export interface AppRouteDefinition {
  path: string;
  component: ComponentType;
  allowedRoles: UserRole[];
  isPublic?: boolean;
}

export interface NavItemDefinition {
  label: string;
  path: string;
  allowedRoles: UserRole[];
  order: number;
}

export interface FeatureModule {
  id: string;
  routes: AppRouteDefinition[];
  navigation: NavItemDefinition[];
}
