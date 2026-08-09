import { Event } from "@/types";
import { events } from "./mock-data";

export function getMockEvents(): Event[] {
  return events;
}

export function getMockEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}