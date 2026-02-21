import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export function SmartImage(props: Props) {
    return (
        <img
            loading="lazy"
            decoding="async"
            {...props}
        />
    );
}
