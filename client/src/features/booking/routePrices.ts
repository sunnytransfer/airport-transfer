export type RouteKey =
    | "DLM->Marmaris"
    | "DLM->Icmeler"
    | "BJV->Marmaris"
    | "BJV->Icmeler";

export const routePricesEUR: Record<RouteKey, number> = {
    "DLM->Marmaris": 55,
    "DLM->Icmeler": 60,
    "BJV->Marmaris": 65,
    "BJV->Icmeler": 70,
};
