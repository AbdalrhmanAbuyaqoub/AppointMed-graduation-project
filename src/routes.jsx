import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { RouteGuard } from "./routes/RouteGuard";
import { ROUTES, LazyComponents } from "./routes/index.jsx";
import PageNotFound from "./pages/PageNotFound";
import Clinics from "./pages/Clinics";
import ClinicDetails from "./pages/ClinicDetails";
import ProfileModal from "./components/ProfileModal";

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
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes location={background || location}>
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
        <Route
          path={ROUTES.REGISTER}
          element={
            <RouteGuard>
              <LazyComponents.Register />
            </RouteGuard>
          }
        />

        {/* User routes - accessible by patient role only */}
        <Route
          path={ROUTES.CHAT}
          element={
            <RouteGuard requireAuth allowedRoles={["patient"]}>
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
          <Route
            path={ROUTES.DASHBOARD}
            element={<LazyComponents.Dashboard />}
          />
          <Route
            path={ROUTES.APPOINTMENTS}
            element={<LazyComponents.Appointments />}
          />
          <Route path={ROUTES.CLINICS} element={<Clinics />} />
          <Route path={ROUTES.CLINIC_DETAILS} element={<ClinicDetails />} />
          <Route path={ROUTES.DOCTORS} element={<LazyComponents.Doctors />} />
          <Route
            path={ROUTES.DOCTOR_DETAILS}
            element={<LazyComponents.DoctorDetails />}
          />
          <Route path={ROUTES.PATIENTS} element={<LazyComponents.Patients />} />
          <Route
            path={ROUTES.PATIENT_DETAILS}
            element={<LazyComponents.PatientDetails />}
          />
        </Route>

        {/* Default route */}
        <Route
          path="*"
          element={
            <RouteGuard requireAuth>
              <PageNotFound />
            </RouteGuard>
          }
        />
      </Routes>

      {/* Contextual modals */}
      {background && (
        <Routes>
          <Route
            path={ROUTES.PROFILE}
            element={
              <RouteGuard requireAuth>
                <ProfileModal />
              </RouteGuard>
            }
          />
        </Routes>
      )}
    </Suspense>
  );
};
