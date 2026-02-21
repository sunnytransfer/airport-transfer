import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Seo } from "@/seo/Seo";
import { useBookingDraft } from "./useBookingDraft";
import { validateBooking } from "./validateBooking";
import { estimatePriceEUR, isKnownRoute } from "./pricing";
import { formatEUR } from "@/utils/formatCurrency";
import { vehicles } from "./vehicles";

export default function BookingPage() {
    const navigate = useNavigate();
    const { draft, actions } = useBookingDraft();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const pickupRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        pickupRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        const { ok, errors: validationErrors } = validateBooking(draft);
        setErrors(validationErrors as Record<string, string>);
        if (ok) {
            setLoading(true);
            sessionStorage.setItem("booking:draft", JSON.stringify(draft));
            navigate("/booking/confirm");
        } else {
            setLoading(false);
        }
    };

    return (
        <>
            <Seo
                title="Booking"
                description="Start your transfer booking"
                canonicalPath="/booking"
            />

            <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
                <h1>Booking</h1>

                {loading && (
                    <div style={{ opacity: .6 }}>Preparing booking…</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gap: 12 }}>
                        <label>
                            Pickup location
                            <select
                                name="pickup"
                                style={{ width: "100%" }}
                                value={draft.pickup}
                                onChange={(e) => actions.set("pickup", e.target.value)}
                            >
                                <option value="">Select pickup</option>
                                <option value="Dalaman Airport">Dalaman Airport</option>
                                <option value="Bodrum Airport">Bodrum Airport</option>
                            </select>
                            {errors.pickup && <small style={{ color: "red" }}>{errors.pickup}</small>}
                        </label>

                        <label>
                            Dropoff location
                            <select
                                name="dropoff"
                                style={{ width: "100%" }}
                                value={draft.dropoff}
                                onChange={(e) => actions.set("dropoff", e.target.value)}
                            >
                                <option value="">Select dropoff</option>
                                <option value="Marmaris">Marmaris</option>
                                <option value="Icmeler">Icmeler</option>
                            </select>
                            {errors.dropoff && <small style={{ color: "red" }}>{errors.dropoff}</small>}
                        </label>

                        <label>
                            Date
                            <input
                                name="date"
                                type="date"
                                style={{ width: "100%" }}
                                value={draft.date}
                                onChange={(e) => actions.set("date", e.target.value)}
                            />
                            {errors.date && <small style={{ color: "red" }}>{errors.date}</small>}
                        </label>

                        <label>
                            Passengers
                            <input
                                name="pax"
                                type="number"
                                min={1}
                                style={{ width: "100%" }}
                                value={draft.pax}
                                onChange={(e) => actions.set("pax", Number(e.target.value))}
                            />
                            {errors.pax && <small style={{ color: "red" }}>{errors.pax}</small>}
                        </label>

                        <label>
                            Vehicle
                            <select
                                value={draft.vehicleId || ""}
                                onChange={(e) => actions.set("vehicleId", e.target.value)}
                                style={{ width: "100%" }}
                            >
                                <option value="">Select vehicle</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.name} (max {v.capacity})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <p style={{ fontWeight: "bold" }}>
                            Price estimate: {formatEUR(estimatePriceEUR(draft))}
                        </p>
                        {!isKnownRoute(draft) && (
                            <small>Route not in fixed list — estimated price shown.</small>
                        )}

                        <button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Continue"}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
