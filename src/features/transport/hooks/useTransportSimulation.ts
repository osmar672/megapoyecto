"use client";

import { useEffect, useState } from "react";
import { transportRepository } from "../services/transportRepository";

export function useTransportSimulation(intervalMilliseconds = 8_000) {
  const [buses, setBuses] = useState(() => transportRepository.listBuses());

  useEffect(() => {
    const interval = window.setInterval(
      () => setBuses(transportRepository.advanceSimulation()),
      intervalMilliseconds,
    );
    return () => window.clearInterval(interval);
  }, [intervalMilliseconds]);

  return buses;
}
