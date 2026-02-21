import { useNavigate } from "react-router-dom";
import { Seo } from "@/seo/Seo";
import { getSiteSetting } from "@/config/getSiteSetting";
import { estimatePriceEUR } from "@/features/booking/pricing";
import { formatEUR } from "@/utils/formatCurrency";
import { saveLocalBooking } from "@/features/booking/localLog";

const phone = getSiteSetting("contact", "whatsapp")?.replace(/\D/g, "");

export default function BookingConfirmPage() {
    const navigate = useNavigate();
    const raw = sessionStorage.getItem("booking:draft");
    const draft = raw ? JSON.parse(raw) : null;

    if (!draft) {
        return (
            <main style={{ padding: 16 }}>
                <p>No booking data.</p>
                <a href="/booking">Start booking</a>
            </main>
        );
    }

    const msg = encodeURIComponent(
        `Transfer booking:
Route: ${draft?.pickup} → ${draft?.dropoff}
Date: ${draft?.date}
Passengers: ${draft?.pax}
Vehicle: ${draft?.vehicleId}
Price: ${formatEUR(estimatePriceEUR(draft!))} EUR`
    );

    return (
        <>
            <Seo title="Confirm" description="Confirm your booking" canonicalPath="/booking/confirm" />
            <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
                <h1>Confirm</h1>
                <p>Pickup: {draft?.pickup}</p>
                <p>Dropoff: {draft?.dropoff}</p>
                <p>Date: {draft?.date}</p>
                <p>Passengers: {draft?.pax}</p>
                <p>Vehicle: {draft?.vehicleId}</p>
                <p>Price: {draft ? formatEUR(estimatePriceEUR(draft)) : "-"}</p>
                <p style={{ color: "#b00", fontWeight: 600 }}>
                    Limited availability — confirm via WhatsApp now.
                </p>
                {phone && (
                    <a
                        href={`https://wa.me/${phone}?text=${msg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { saveLocalBooking(draft); navigate("/booking/success"); }}
                    >
                        Continue on WhatsApp
                    </a>
                )}
                <a href="/booking">Edit booking</a>
            </main>
        </>
    );
}
