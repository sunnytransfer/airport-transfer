import React from "react";

type Props = { children: React.ReactNode };

export class RouteErrorBoundary extends React.Component<Props, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

export default RouteErrorBoundary;
