import React from "react";

import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

type Props = {
    children: React.ReactNode;
};

export function LazyRoute({ children }: Props) {
    return (
        <RouteErrorBoundary>
            <React.Suspense fallback={null}>
                {children}
            </React.Suspense>
        </RouteErrorBoundary>
    );
}
