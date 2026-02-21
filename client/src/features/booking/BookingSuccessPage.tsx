import { useEffect } from "react";

export default function BookingSuccessPage() {
    const hasDraft = sessionStorage.getItem("booking:draft");

    useEffect(() => {
        sessionStorage.removeItem("booking:draft");
    }, []);

    if (!hasDraft) {
        return (
            <main style={{ padding: 16 }}>
                <a href="/booking">Start booking</a>
            </main>
        );
    }

    return (
        <main style={{ padding: 16 }}>
            <h1>Request Sent</h1>
            <p>We will contact you shortly.</p>
        </main>
    );
}
