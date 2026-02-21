import type { BookingDraft } from "./booking.types";
import { vehicles } from "./vehicles";
import { routePricesEUR } from "./routePrices";

function normalizeLocation(v: string) {
    const s = v.toLowerCase();
    if (s.includes("dalaman")) return "DLM";
    if (s.includes("bodrum")) return "BJV";
    if (s.includes("marmaris")) return "Marmaris";
    if (s.includes("icmeler")) return "Icmeler";
    return v;
}

function buildRouteKey(pickup: string, dropoff: string) {
    const p = normalizeLocation(pickup);
    const d = normalizeLocation(dropoff);
    return `${p}->${d}` as keyof typeof routePricesEUR;
}

function seasonalMultiplier(date: string) {
    const month = new Date(date).getMonth() + 1;
    if (month >= 6 && month <= 9) return 1.15;
    return 1;
}

export function estimatePriceEUR(d: BookingDraft) {
    const routeKey = buildRouteKey(d.pickup, d.dropoff);
    const reversed = `${routeKey.split("->")[1]}->${routeKey.split("->")[0]}` as keyof typeof routePricesEUR;
    const routeBase = routePricesEUR[routeKey] ?? routePricesEUR[reversed] ?? 50;

    const vehicle = vehicles.find(v => v.id === d.vehicleId);
    const vehicleMultiplier = vehicle ? vehicle.basePrice / 25 : 1;

    const paxExtra = Math.max(0, d.pax - 2) * 3;

    return Math.round((routeBase * vehicleMultiplier + paxExtra) * seasonalMultiplier(d.date));
}

export function isKnownRoute(d: BookingDraft): boolean {
    const routeKey = buildRouteKey(d.pickup, d.dropoff);
    const reversed = `${routeKey.split("->")[1]}->${routeKey.split("->")[0]}` as keyof typeof routePricesEUR;
    return routeKey in routePricesEUR || reversed in routePricesEUR;
}
