import { appEventBus } from "../../../core/events/appEventBus";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { Bus, BusRoute } from "../../../core/types/domain";

function readBuses(): Bus[] {
  return localStorageService.get<Bus[]>(storageKeys.buses, []).value;
}

export const transportRepository = {
  listBuses(): Bus[] {
    return readBuses().sort((first, second) => first.number.localeCompare(second.number));
  },

  listRoutes(): BusRoute[] {
    return localStorageService
      .get<BusRoute[]>(storageKeys.busRoutes, [])
      .value.sort((first, second) => first.departureTime.localeCompare(second.departureTime));
  },

  advanceSimulation(): Bus[] {
    const buses = readBuses().map((bus) => {
      if (bus.status === "OUT_OF_SERVICE" || bus.status === "FINISHED") return bus;
      const updated: Bus = {
        ...bus,
        position: { x: (bus.position.x + 4) % 92 + 4, y: (bus.position.y + 2) % 82 + 8 },
        updatedAt: new Date().toISOString(),
      };
      appEventBus.emit("bus:updated", { bus: updated });
      return updated;
    });
    localStorageService.set(storageKeys.buses, buses);
    return buses;
  },
};
