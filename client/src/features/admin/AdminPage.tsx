import { Seo } from "@/seo/Seo";
import { getLocalBookings } from "@/features/booking/localLog";

export default function AdminPage() {
    const bookings = getLocalBookings();

    return (
        <>
            <Seo title="Admin" description="Booking log" canonicalPath="/admin" />
            <main style={{ padding: 16 }}>
                <h1>Booking Log</h1>
                <button onClick={() => { localStorage.removeItem("booking:log"); location.reload(); }}>
                    Clear log
                </button>
                {bookings.length === 0 && <p>No bookings yet.</p>}
                {bookings.map((b: any) => (
                    <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
                        <div><strong>{b.pickup} → {b.dropoff}</strong></div>
                        <div>Date: {b.date}</div>
                        <div>Pax: {b.pax}</div>
                        <div>Vehicle: {b.vehicleId}</div>
                    </div>
                ))}
            </main>
        </>
    );
}
