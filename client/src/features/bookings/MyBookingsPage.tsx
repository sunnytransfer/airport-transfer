import { Seo } from "@/seo/Seo";

export default function MyBookingsPage() {
    return (
        <>
            <Seo
                title="My Bookings"
                description="Your booking requests"
                canonicalPath="/my-bookings"
            />
            <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
                <h1>My Bookings</h1>
                <p>Coming soon.</p>
            </main>
        </>
    );
}
