import { useState } from "react";
import { BookingDraft, emptyBookingDraft } from "./booking.types";

const SESSION_KEY = "booking:draft";

function loadDraft(): BookingDraft {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) return { ...emptyBookingDraft, ...JSON.parse(raw) };
    } catch {
        // ignore
    }
    return { ...emptyBookingDraft };
}

export function useBookingDraft() {
    const [draft, setDraft] = useState<BookingDraft>(loadDraft);

    const actions = {
        set<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
            setDraft((prev) => {
                const next = { ...prev, [key]: value };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
                return next;
            });
        },
        reset() {
            sessionStorage.removeItem(SESSION_KEY);
            setDraft({ ...emptyBookingDraft });
        },
    };

    return { draft, actions };
}
