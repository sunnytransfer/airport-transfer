export type BookingDraft = {
    pickup: string;
    dropoff: string;
    date: string;
    pax: number;
    vehicleId?: string;
};

export const emptyBookingDraft: BookingDraft = {
    pickup: "",
    dropoff: "",
    date: "",
    pax: 2,
};
