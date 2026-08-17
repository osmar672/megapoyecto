import type { ReactNode } from "react";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT_FAMILY" | "STAFF";
export const ALL_ROLES: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];

export interface User { id: string; firstName: string; lastName: string; role: UserRole; email: string; isActive: boolean; }
export interface NavigationItem { label: string; path: string; allowedRoles: UserRole[]; order: number; }
export interface FeatureRoute { path: string; element: ReactNode; allowedRoles: UserRole[]; }
export interface SearchResult { id: string; category: string; title: string; description: string; path: string; keywords: string[]; allowedRoles: UserRole[]; source: string; }
export interface SearchProvider { id: string; search(query: string): SearchResult[]; }
export interface WidgetDefinition { id: string; title: string; order: number; allowedRoles: UserRole[]; render: (user: User) => ReactNode; }

export interface BusStop { id: string; name: string; order: number; scheduledTime: string; }
export interface BusRoute { id: string; name: string; shift: "MORNING" | "AFTERNOON"; departureTime: string; arrivalTime: string; isActive: boolean; stops: BusStop[]; }
export interface Bus { id: string; number: string; routeId: string; driverName: string; nextStop: string; estimatedArrival: string; status: "ON_TIME" | "DELAYED" | "UNAVAILABLE"; position: { x: number; y: number }; }

export interface CafeteriaProduct { id: string; name: string; description: string; price: number; category: "COMIDAS" | "BEBIDAS" | "SNACKS" | "POSTRES" | "SALUDABLE"; availability: "AVAILABLE" | "LIMITED" | "UNAVAILABLE"; }
export interface EmergencyNotice { id: string; title: string; body: string; kind: "EVACUATION" | "WARNING" | "ALL_CLEAR" | "INFORMATION"; status: "ACTIVE" | "RESOLVED"; authorUserId: string; publishedAt: string; resolvedAt?: string; }
export interface ScheduleEntry { id: string; courseId: string; subject: string; teacherName: string; userId: string; studentId?: string; dayOfWeek: 1 | 2 | 3 | 4 | 5; startTime: string; endTime: string; location: string; type: "CLASS" | "ACTIVITY"; }
