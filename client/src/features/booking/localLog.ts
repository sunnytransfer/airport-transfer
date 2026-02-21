export function saveLocalBooking(entry: unknown) {
    const raw = localStorage.getItem("booking:log");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...(entry as object),
    });
    localStorage.setItem("booking:log", JSON.stringify(list));
}

export function getLocalBookings() {
    const raw = localStorage.getItem("booking:log");
    return (raw ? JSON.parse(raw) : []).sort(
        (a: any, b: any) => b.id - a.id
    );
}
