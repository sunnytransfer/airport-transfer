export type VehicleType = {
    id: string;
    name: string;
    capacity: number;
    basePrice: number;
};

export const vehicles: VehicleType[] = [
    { id: "sedan", name: "Sedan", capacity: 3, basePrice: 25 },
    { id: "minivan", name: "Minivan", capacity: 6, basePrice: 40 },
    { id: "vip", name: "VIP", capacity: 4, basePrice: 60 }
];
