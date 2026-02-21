import type { BookingDraft } from "./booking.types";
import { vehicles } from "./vehicles";
import { isAvailable } from "./availability";

export function validateBooking(d: BookingDraft) {
    const errors: Partial<Record<keyof BookingDraft, string>> = {};

    if (!d.pickup.trim()) errors.pickup = "Pickup is required";
    if (!d.dropoff.trim()) errors.dropoff = "Dropoff is required";
    if (!d.date) errors.date = "Date is required";
    else if (!isAvailable(d.date)) errors.date = "Date not available";
    if (!Number.isFinite(d.pax) || d.pax < 1) errors.pax = "Passengers must be at least 1";

    if (!d.vehicleId) {
        errors.vehicleId = "Select vehicle";
    } else {
        const v = vehicles.find(x => x.id === d.vehicleId);
        if (v && d.pax > v.capacity) errors.pax = "Too many passengers for vehicle";
    }

    const ok = Object.keys(errors).length === 0;
    return { ok, errors };
}
