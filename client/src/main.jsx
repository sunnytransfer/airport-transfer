performance.mark("app_bootstrap_start");

import { silenceConsoleInProduction } from "@/utils/silenceConsole";
silenceConsoleInProduction();

import { attachGlobalErrorHandlers } from "@/utils/runtimeErrors";
attachGlobalErrorHandlers();

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "@/styles/performance.css";

import "@/config/buildGuard";

import { EXECUTION_CHECK } from "@/__check__/execution";

if (EXECUTION_CHECK !== "SITE_SETTINGS_PIPELINE_ACTIVE") {
    throw new Error("Execution pipeline broken");
}

console.log("EXECUTION:", EXECUTION_CHECK);
console.info("SITE SETTINGS PIPELINE RUNNING");

import { validateSiteSettings } from "@/config/validateSiteSettings";

validateSiteSettings();

import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>,
)

performance.mark("app_bootstrap_end");
performance.measure("app_bootstrap", "app_bootstrap_start", "app_bootstrap_end");

import { getSiteSetting } from "@/config";

if (import.meta.env.DEV) {
    const entry = performance.getEntriesByName("app_bootstrap")[0];
    if (entry) {
        console.info("BOOTSTRAP(ms):", Math.round(entry.duration));
    }
    console.info(
        "APP_VERSION:",
        getSiteSetting("app", "version")
    );
}

performance.clearMarks("app_bootstrap_start");
performance.clearMarks("app_bootstrap_end");
performance.clearMeasures("app_bootstrap");
