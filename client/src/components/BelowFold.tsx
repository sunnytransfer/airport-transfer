import React from "react";

type Props = {
    children: React.ReactNode;
};

export function BelowFold({ children }: Props) {
    return (
        <section data-below-fold="true">
            {children}
        </section>
    );
}
