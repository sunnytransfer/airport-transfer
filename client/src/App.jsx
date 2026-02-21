import React, { lazy, Suspense } from 'react';

const Admin = lazy(() => import('./pages/Admin'));
const HeaderBuilder = lazy(() => import('./pages/admin/HeaderBuilder'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
import Home from './pages/Home';



import Blog from './pages/Blog';
import Checkout from './pages/Checkout';
import Excursions from './pages/Excursions';

const SeoTest = React.lazy(() => import("@/pages/SeoTest"));
const BookingPage = React.lazy(() => import("@/features/booking/BookingPage"));
const BookingConfirmPage = React.lazy(() => import("@/features/booking/BookingConfirmPage"));
const AdminPage = React.lazy(() => import("@/features/admin/AdminPage"));

import { preloadRoutes } from "@/router/preloadRoutes";

import { onIdle } from "@/utils/idle";
import { getSiteSetting } from "@/config/getSiteSetting";

if (getSiteSetting("performance", "prefetchRoutes")) {
    onIdle(() => preloadRoutes.seoTest());
}

import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CurrencyProvider } from './context/CurrencyContext';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './auth/AuthContext';
import { SeoDefaults } from "@/seo/SeoDefaults";
import { LazyRoute } from "@/components";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";

function App() {
    return (
        <SiteProvider>
            <CurrencyProvider>
                <AuthProvider>
                    <Router>
                        <SeoDefaults />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                {/* Public Routes */}
                                <Route element={<PublicLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/booking" element={
                                        <RouteErrorBoundary>
                                            <LazyRoute>
                                                <BookingPage />
                                            </LazyRoute>
                                        </RouteErrorBoundary>
                                    } />
                                    <Route path="/booking/confirm" element={
                                        <RouteErrorBoundary>
                                            <LazyRoute>
                                                <BookingConfirmPage />
                                            </LazyRoute>
                                        </RouteErrorBoundary>
                                    } />
                                    <Route path="/excursions" element={<Excursions />} />
                                    <Route path="/blog" element={<Blog />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/seo-test" element={
                                        <React.Suspense fallback={null}>
                                            <SeoTest />
                                        </React.Suspense>
                                    } />
                                </Route>

                                {/* Admin Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route element={<AdminLayout />}>
                                        <Route path="/admin" element={<Admin />} />
                                        <Route path="/admin/header" element={<HeaderBuilder />} />
                                        <Route path="/admin/settings" element={<AdminSettings />} />
                                        <Route path="/admin/log" element={<LazyRoute><AdminPage /></LazyRoute>} />
                                    </Route>
                                </Route>
                            </Routes>
                        </Suspense>
                    </Router>
                </AuthProvider>
            </CurrencyProvider>
            <div id="exec-check" style={{ position: "fixed", bottom: 4, right: 6, fontSize: 10, opacity: .4 }}>
                SITE_SETTINGS_ACTIVE
            </div>
        </SiteProvider>
    );
}

export default App;
