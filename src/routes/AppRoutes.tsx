import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ParksPage } from '../pages/ParksPage';
import { ParkDetailPage } from '../pages/ParkDetailPage';
import { Phase1PermitsPage } from '../pages/Phase1PermitsPage';
import { Phase2InfrastructurePage } from '../pages/Phase2InfrastructurePage';
import { Phase3SignagePage } from '../pages/Phase3SignagePage';
import { SchedulesPage } from '../pages/SchedulesPage';
import { AssociationsPage } from '../pages/AssociationsPage';
import { TemplatesPage } from '../pages/TemplatesPage';
import { ProfilePage } from '../pages/ProfilePage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected App Routes within Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="parks" element={<ParksPage />} />
        <Route path="parks/:parkId" element={<ParkDetailPage />} />
        <Route path="parks/:parkId/phase-1" element={<Phase1PermitsPage />} />
        <Route path="parks/:parkId/phase-2" element={<Phase2InfrastructurePage />} />
        <Route path="parks/:parkId/phase-3" element={<Phase3SignagePage />} />
        <Route path="parks/:parkId/schedules" element={<SchedulesPage />} />
        <Route path="associations" element={<AssociationsPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Admin only route */}
        <Route
          path="users"
          element={
            <ProtectedRoute requireAdmin>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
