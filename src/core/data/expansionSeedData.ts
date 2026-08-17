import type {
  Achievement,
  Bus,
  BusRoute,
  CafeteriaProduct,
  CampusLocation,
  EmergencyNotice,
  ForumComment,
  ForumPost,
  Incident,
  ScheduleEntry,
  TimelineEvent,
} from "../types/domain";

const seededAt = "2026-08-17T12:00:00.000Z";

function addMinutes(time: string, minutesToAdd: number): string {
  const [hours, minutes] = time.split(":").map(Number);
  const minutesInDay = 24 * 60;
  const totalMinutes = (hours * 60 + minutes + minutesToAdd) % minutesInDay;

  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

const timelineRows: Array<[
  string,
  string,
  string,
  TimelineEvent["type"],
  string,
  string | undefined,
  string | undefined,
]> = [
  ["evt_001", "Inicio del segundo trimestre", "Apertura oficial del período lectivo.", "ACADEMIC", "2026-08-17T07:00:00-06:00", "2026-08-17T08:00:00-06:00", "Auditorio"],
  ["evt_002", "Examen de Matemática", "Evaluación del primer bloque de contenidos.", "ACADEMIC", "2026-08-18T08:00:00-06:00", "2026-08-18T09:20:00-06:00", "Aula 9-1"],
  ["evt_003", "Feria tecnológica", "Exposición de proyectos estudiantiles.", "ACTIVITY", "2026-08-20T10:30:00-06:00", "2026-08-20T14:00:00-06:00", "Laboratorio 2"],
  ["evt_004", "Jornada deportiva", "Encuentros recreativos entre secciones.", "ACTIVITY", "2026-08-22T09:00:00-06:00", "2026-08-22T12:00:00-06:00", "Cancha central"],
  ["evt_005", "Entrega de proyecto de Ciencias", "Fecha límite del proyecto experimental.", "DEADLINE", "2026-08-24T16:00:00-06:00", undefined, "Plataforma académica"],
  ["evt_006", "Reunión de familias", "Seguimiento del rendimiento del trimestre.", "ANNOUNCEMENT", "2026-08-28T16:00:00-06:00", "2026-08-28T18:00:00-06:00", "Auditorio"],
  ["evt_007", "Simulacro de evacuación", "Práctica institucional programada.", "ACTIVITY", "2026-09-02T10:00:00-06:00", "2026-09-02T10:40:00-06:00", "Punto de reunión"],
  ["evt_008", "Semana de vacaciones", "Receso de medio período.", "ANNOUNCEMENT", "2026-09-14T00:00:00-06:00", "2026-09-18T23:59:00-06:00", undefined],
  ["evt_009", "Matrícula de clubes", "Inscripción para actividades extracurriculares.", "ACTIVITY", "2026-09-21T11:00:00-06:00", "2026-09-21T13:00:00-06:00", "Biblioteca"],
  ["evt_010", "Consejo institucional", "Sesión administrativa mensual.", "ACADEMIC", "2026-09-25T14:00:00-06:00", "2026-09-25T16:00:00-06:00", "Sala de reuniones"],
];

export const seedTimelineEvents: TimelineEvent[] = timelineRows.map(([id, title, description, type, startsAt, endsAt, location], index) => ({
  id,
  title,
  description,
  type: type as TimelineEvent["type"],
  startsAt,
  endsAt,
  location,
  audience: "ALL",
  isHighlighted: index < 3,
  createdAt: seededAt,
  updatedAt: seededAt,
}));

export const seedCampusLocations: CampusLocation[] = [
  ["loc_001", "Dirección", "ADMINISTRATION", "Atención administrativa y dirección institucional.", 18, 18, true, ["oficina", "director"]],
  ["loc_002", "Biblioteca", "LEARNING", "Préstamo de libros, estudio y consulta.", 42, 22, true, ["libros", "estudio"]],
  ["loc_003", "Laboratorio 1", "LAB", "Laboratorio de informática del edificio A.", 66, 20, true, ["computadoras", "tecnología"]],
  ["loc_004", "Laboratorio 2", "LAB", "Laboratorio de ciencias del edificio B.", 82, 32, true, ["ciencias", "experimentos"]],
  ["loc_005", "Gimnasio", "SPORTS", "Espacio cubierto para actividad física.", 22, 64, true, ["deporte", "educación física"]],
  ["loc_006", "Cancha central", "SPORTS", "Cancha multiuso al aire libre.", 47, 70, true, ["fútbol", "baloncesto"]],
  ["loc_007", "Soda", "SERVICE", "Cafetería escolar y comedor.", 72, 62, true, ["comida", "cafetería"]],
  ["loc_008", "Enfermería", "HEALTH", "Atención primaria y primeros auxilios.", 84, 52, true, ["salud", "médico"]],
  ["loc_009", "Baños accesibles", "SERVICE", "Servicios sanitarios accesibles.", 58, 45, true, ["baños", "sanitarios"]],
  ["loc_010", "Parqueo", "ACCESS", "Estacionamiento para personal y visitas.", 12, 86, true, ["carros", "vehículos"]],
  ["loc_011", "Entrada principal", "ACCESS", "Acceso peatonal y control de ingreso.", 8, 46, true, ["entrada", "salida"]],
  ["loc_012", "Punto de reunión", "SAFETY", "Zona segura para evacuaciones.", 76, 86, true, ["emergencia", "evacuación"]],
].map(([id, name, type, description, x, y, isAccessible, searchTerms]) => ({
  id,
  name,
  type,
  description,
  x,
  y,
  isAccessible,
  searchTerms,
  updatedAt: seededAt,
})) as CampusLocation[];

export const seedEmergencyNotices: EmergencyNotice[] = [
  {
    id: "emg_001",
    title: "Operación normal",
    body: "No existen alertas activas en el campus.",
    kind: "INFORMATION",
    status: "RESOLVED",
    authorUserId: "usr_staff_001",
    publishedAt: seededAt,
    resolvedAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "emg_002",
    title: "Simulacro programado",
    body: "El simulacro de evacuación se realizará el 2 de septiembre a las 10:00 a. m.",
    kind: "INFORMATION",
    status: "ACTIVE",
    authorUserId: "usr_staff_001",
    publishedAt: seededAt,
    updatedAt: seededAt,
  },
];

const routeRows: Array<[string, string, BusRoute["shift"], string, string, string[]]> = [
  ["route_north", "Ruta Norte", "MORNING", "05:45", "07:00", ["El Roble", "Barranca", "Centro", "Colegio"]],
  ["route_south", "Ruta Sur", "MORNING", "05:55", "07:05", ["Chacarita", "Fray Casiano", "Centro", "Colegio"]],
  ["route_central", "Ruta Centro", "AFTERNOON", "14:20", "15:30", ["Colegio", "Centro", "Barranca", "El Roble"]],
  ["route_special", "Ruta Especial", "AFTERNOON", "14:35", "15:25", ["Colegio", "Hospital", "Terminal", "Chacarita"]],
];

export const seedBusRoutes: BusRoute[] = routeRows.map(([id, name, shift, departureTime, arrivalTime, stops]) => ({
  id,
  name,
  shift: shift as BusRoute["shift"],
  departureTime,
  arrivalTime,
  stops: stops.map((stop, index) => ({
    id: `${id}_stop_${index + 1}`,
    name: stop,
    order: index + 1,
    scheduledTime: addMinutes(departureTime, index * 15),
  })),
  isActive: true,
  updatedAt: seededAt,
}));

const busRows: Array<[string, string, string, string, string, string, Bus["status"], number, number]> = [
  ["bus_01", "01", "route_north", "Carlos Méndez", "Barranca", "06:32", "ON_TIME", 32, 42],
  ["bus_02", "02", "route_south", "María Vargas", "Centro", "06:45", "DELAYED", 58, 55],
  ["bus_03", "03", "route_central", "Luis Rojas", "Colegio", "14:20", "ON_TIME", 78, 32],
  ["bus_04", "04", "route_special", "Ana Solano", "Hospital", "14:50", "OUT_OF_SERVICE", 18, 72],
];

export const seedBuses: Bus[] = busRows.map(([id, number, routeId, driverName, nextStop, estimatedArrival, status, x, y]) => ({
  id,
  number,
  routeId,
  driverName,
  nextStop,
  estimatedArrival,
  status: status as Bus["status"],
  position: { x, y },
  updatedAt: seededAt,
}));

const productNames = [
  ["Arroz con pollo", "COMIDAS", 1800], ["Casado vegetariano", "SALUDABLE", 2000],
  ["Sándwich de pollo", "COMIDAS", 1500], ["Ensalada fresca", "SALUDABLE", 1600],
  ["Empanada de queso", "SNACKS", 900], ["Galletas integrales", "SNACKS", 700],
  ["Yogur con fruta", "POSTRES", 1100], ["Gelatina", "POSTRES", 650],
  ["Jugo natural", "BEBIDAS", 900], ["Agua", "BEBIDAS", 600],
  ["Leche chocolatada", "BEBIDAS", 850], ["Wrap de vegetales", "SALUDABLE", 1700],
  ["Queque de zanahoria", "POSTRES", 1000], ["Fruta picada", "SALUDABLE", 900],
  ["Pinto con huevo", "COMIDAS", 1750],
] as const;

export const seedCafeteriaProducts: CafeteriaProduct[] = productNames.map(
  ([name, category, price], index) => ({
    id: `product_${String(index + 1).padStart(2, "0")}`,
    name,
    description: "Producto de demostración disponible en la soda escolar.",
    price,
    category,
    availability: index === 5 ? "UNAVAILABLE" : index % 4 === 0 ? "LIMITED" : "AVAILABLE",
    imageAlt: `Representación visual de ${name}`,
    updatedAt: seededAt,
  }),
);

const scheduleTemplate = [
  [1, "07:00", "08:20", "Matemática", "Mauricio Vargas", "Aula 9-1"],
  [1, "08:40", "10:00", "Ciencias", "Mauricio Vargas", "Laboratorio 2"],
  [2, "07:00", "08:20", "Español", "Laura Jiménez", "Aula 9-1"],
  [2, "08:40", "10:00", "Estudios Sociales", "José Quesada", "Aula 9-1"],
  [3, "07:00", "08:20", "Inglés", "Ana Salas", "Aula 9-1"],
  [3, "08:40", "10:00", "Informática", "Carlos Brenes", "Laboratorio 1"],
  [4, "07:00", "08:20", "Matemática", "Mauricio Vargas", "Aula 9-1"],
  [4, "08:40", "10:00", "Educación Física", "Paola Mora", "Gimnasio"],
  [5, "07:00", "08:20", "Ciencias", "Mauricio Vargas", "Laboratorio 2"],
  [5, "08:40", "10:00", "Arte", "María León", "Aula de Arte"],
] as const;

export const seedScheduleEntries: ScheduleEntry[] = scheduleTemplate.map(
  ([dayOfWeek, startTime, endTime, subject, teacherName, location], index) => ({
    id: `schedule_${String(index + 1).padStart(2, "0")}`,
    userId: "usr_teacher_001",
    studentId: "stu_001",
    courseId: index % 2 === 0 ? "crs_math_001" : "crs_science_001",
    dayOfWeek,
    startTime,
    endTime,
    subject,
    teacherName,
    location,
    type: "CLASS",
    updatedAt: seededAt,
  }),
);

const achievementRows: Array<[
  string,
  string,
  string,
  Achievement["category"],
  number,
  number,
  string | undefined,
]> = [
  ["ach_01", "Primera semana", "Completar la primera semana lectiva.", "PERSONAL", 1, 1, seededAt],
  ["ach_02", "Asistencia perfecta", "Mantener asistencia completa durante un mes.", "ACADEMIC", 18, 20, undefined],
  ["ach_03", "Participación deportiva", "Participar en una actividad deportiva.", "PARTICIPATION", 1, 1, seededAt],
  ["ach_04", "Participación cultural", "Participar en una actividad cultural.", "PARTICIPATION", 0, 1, undefined],
  ["ach_05", "Buen rendimiento", "Obtener un promedio superior a 85.", "ACADEMIC", 88, 85, seededAt],
  ["ach_06", "Vida escolar", "Completar cinco actividades escolares.", "PARTICIPATION", 3, 5, undefined],
  ["ach_07", "Ayuda a la comunidad", "Colaborar en una iniciativa comunitaria.", "COMMUNITY", 0, 1, undefined],
  ["ach_08", "Metas completadas", "Completar diez tareas académicas.", "PERSONAL", 7, 10, undefined],
];

export const seedAchievements: Achievement[] = achievementRows.map(([id, title, description, category, progress, target, unlockedAt]) => ({
  id,
  userId: "usr_family_001",
  title,
  description,
  category: category as Achievement["category"],
  iconKey: "badge",
  progress,
  target,
  unlockedAt,
  createdAt: seededAt,
  updatedAt: seededAt,
}));

export const seedForumPosts: ForumPost[] = [
  ["post_001", "Club de programación", "Abrimos inscripciones para el club de programación.", "Tecnología"],
  ["post_002", "Feria científica", "Compartamos ideas para los proyectos de la feria.", "Académico"],
  ["post_003", "Entrenamiento deportivo", "El entrenamiento del jueves cambia a las 3:00 p. m.", "Deportes"],
].map(([id, title, body, category], index) => ({
  id,
  authorUserId: index === 0 ? "usr_teacher_001" : "usr_staff_001",
  title,
  body,
  category,
  status: "ACTIVE",
  reactionUserIds: [],
  reportCount: 0,
  createdAt: seededAt,
  updatedAt: seededAt,
}));

export const seedForumComments: ForumComment[] = [
  {
    id: "comment_001",
    postId: "post_001",
    authorUserId: "usr_family_001",
    body: "¿Qué días se reunirá el club?",
    status: "ACTIVE",
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];

const incidentTypes = ["Tecnología", "Infraestructura", "Transporte", "Aula", "Limpieza", "Seguridad", "Tecnología", "Infraestructura", "Aula", "Otro"];
export const seedIncidents: Incident[] = incidentTypes.map((type, index) => ({
  id: `incident_${String(index + 1).padStart(2, "0")}`,
  reporterUserId: index % 2 === 0 ? "usr_teacher_001" : "usr_staff_001",
  type,
  description: `Incidencia demostrativa ${index + 1} para validar el seguimiento institucional.`,
  location: index % 2 === 0 ? "Edificio A" : "Edificio B",
  occurredAt: `2026-08-${String(7 + index).padStart(2, "0")}T10:00:00-06:00`,
  priority: index === 5 ? "URGENT" : index % 3 === 0 ? "HIGH" : "MEDIUM",
  status: index < 2 ? "RESOLVED" : index < 5 ? "IN_REVIEW" : "REPORTED",
  evidence: [],
  createdAt: seededAt,
  updatedAt: seededAt,
}));
