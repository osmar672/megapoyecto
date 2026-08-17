import { emergenciesFeature } from "../features/emergencies/feature";
import { transportFeature } from "../features/transport/feature";
import { cafeteriaFeature } from "../features/cafeteria/feature";
import { schedulesFeature } from "../features/schedules/feature";
import { calendarFeature } from "../features/calendar/feature";
import { libraryFeature } from "../features/library/feature";
import { roombookingsFeature } from "../features/room-bookings/feature";
import { resourcesFeature } from "../features/resources/feature";
import { documentsFeature } from "../features/documents/feature";
import { requestsFeature } from "../features/requests/feature";
import { inventoryFeature } from "../features/inventory/feature";
import { directoryFeature } from "../features/directory/feature";
import { itsupportFeature } from "../features/it-support/feature";
import { transportPassFeature } from "../features/transport-pass/feature";
import { analyticsFeature } from "../features/analytics/feature";
import { achievementsFeature } from "../features/achievements/feature";
import { forumFeature } from "../features/forum/feature";
import { incidentsFeature } from "../features/incidents/feature";
import { announcementsFeature } from "../features/announcements/feature";
import { notificationsFeature } from "../features/notifications/feature";


export const features = [schedulesFeature, calendarFeature, transportPassFeature, transportFeature, cafeteriaFeature, emergenciesFeature, libraryFeature, roombookingsFeature, resourcesFeature, documentsFeature, requestsFeature, inventoryFeature, directoryFeature, itsupportFeature, announcementsFeature, notificationsFeature, achievementsFeature, forumFeature, incidentsFeature, analyticsFeature] as const;
export const searchProviders = features.map((feature) => feature.search).filter(Boolean);
export const widgets = features.map((feature) => feature.widget).filter(Boolean);
