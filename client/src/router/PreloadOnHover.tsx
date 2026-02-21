import React from "react";
import type { PreloadFn } from "@/router/preloadRoutes";

type Props = {
    preload: PreloadFn;
    children: React.ReactElement;
};

export function PreloadOnHover({ preload, children }: Props) {
    return React.cloneElement(children, {
        onMouseEnter: (e: any) => {
            preload();
            children.props.onMouseEnter?.(e);
        },
        onFocus: (e: any) => {
            preload();
            children.props.onFocus?.(e);
        },
    });
}
