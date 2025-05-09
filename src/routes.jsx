import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { RouteGuard } from "./components/RouteGuard";
import { useAuth } from "./context/AuthContext";
import { ROUTES, LazyComponents } from "./routes/index";

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route
          path={ROUTES.LANDING}
          element={
            <RouteGuard>
              <LazyComponents.Landing />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={
            <RouteGuard>
              <LazyComponents.Login />
            </RouteGuard>
          }
        />

        {/* User routes - accessible by both user and admin roles */}
        <Route
          path={ROUTES.CHAT}
          element={
            <RouteGuard requireAuth allowedRoles={["user", "admin"]}>
              <LazyComponents.Chat />
            </RouteGuard>
          }
        />

        {/* Admin-only routes */}
        <Route
          element={
            <RouteGuard requireAuth allowedRoles={["admin"]}>
              <MainLayout />
            </RouteGuard>
          }
        >
          <Route path={ROUTES.HOME} element={<LazyComponents.Home />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={<LazyComponents.Dashboard />}
          />
          <Route path={ROUTES.SETTINGS} element={<LazyComponents.Settings />} />
        </Route>

        {/* Default route */}
        <Route
          path="*"
          element={
            <RouteGuard requireAuth>
              <Navigate
                to={user?.role === "admin" ? ROUTES.DASHBOARD : ROUTES.CHAT}
                replace
              />
            </RouteGuard>
          }
        />
      </Routes>
    </Suspense>
  );
};
