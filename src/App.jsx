import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import ModulePlaceholder from './pages/shared/ModulePlaceholder';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import LoanApplication from './pages/employee/LoanApplication';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import CreditDashboard from './pages/credit/CreditDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import ManagementDashboard from './pages/management/ManagementDashboard';
import RecoveryDashboard from './pages/recovery/RecoveryDashboard';

// Mock components for pages
const PlaceholderPage = ({ title }) => (
  <div className="space-y-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-display font-bold">{title}</h1>
      <p className="text-slate-400">Welcome to the {title} module. Detailed view is coming soon.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass p-6 rounded-2xl h-40 flex items-center justify-center border-dashed border-slate-700/50">
          <span className="text-slate-500 font-medium">Metric Card {i}</span>
        </div>
      ))}
    </div>
  </div>
);

import MyStatus from './pages/employee/MyStatus';
import Statements from './pages/employee/Statements';
import VerificationQueue from './pages/hr/VerificationQueue';
import CreditQueue from './pages/credit/CreditQueue';
import PayoutQueue from './pages/finance/PayoutQueue';
import ApplicationsPipeline from './pages/admin/ApplicationsPipeline';
import ManagementReports from './pages/management/ManagementReports';
import RecoveryList from './pages/recovery/RecoveryList';
import HistoryPage from './pages/shared/HistoryPage';
import UserManagement from './pages/admin/UserManagement';
import Reconciliation from './pages/finance/Reconciliation';
import ManagementAnalytics from './pages/management/ManagementAnalytics';
import DocumentsCenter from './pages/employee/DocumentsCenter';
import Profile from './pages/shared/Profile';
import ApplicationFullView from './pages/employee/ApplicationFullView';
import HRVerificationDetail from './pages/hr/HRVerificationDetail';
import HREmployees from './pages/hr/HREmployees';
import HRReports from './pages/hr/HRReports';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div className="min-h-screen bg-white flex items-center justify-center text-slate-200 font-display text-2xl lowercase font-bold tracking-tight">registration in progress...</div>} />

      {/* Role-Based Protected Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="apply" element={<LoanApplication />} />
                <Route path="status" element={<MyStatus />} />
                <Route path="statements" element={<Statements />} />
                <Route path="documents" element={<DocumentsCenter />} />
                <Route path="application/:id" element={<ApplicationFullView />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="applications" element={<ApplicationsPipeline />} />
                <Route path="pipeline" element={<ApplicationsPipeline />} />
                <Route path="applications/:id" element={<AdminApplicationDetail />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="companies" element={<ModulePlaceholder title="Company Management" />} />
                <Route path="documents" element={<ModulePlaceholder title="Document Repository" />} />
                <Route path="reports" element={<ModulePlaceholder title="System Reports" />} />
                <Route path="audit-logs" element={<ModulePlaceholder title="Audit Logs" />} />
                <Route path="reconciliation" element={<Reconciliation />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HRDashboard />} />
                <Route path="verifications" element={<VerificationQueue />} />
                <Route path="verifications/:id" element={<HRVerificationDetail />} />
                <Route path="employees" element={<HREmployees />} />
                <Route path="reports" element={<HRReports />} />
                <Route path="history" element={<HistoryPage title="Verification History" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/credit/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CREDIT]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<CreditDashboard />} />
                <Route path="queue" element={<CreditQueue />} />
                <Route path="reviews" element={<ModulePlaceholder title="Risk Reviews" />} />
                <Route path="history" element={<HistoryPage title="Assessment History" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.FINANCE]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="payouts" element={<PayoutQueue />} />
                <Route path="history" element={<HistoryPage title="Payout History" />} />
                <Route path="reconciliation" element={<Reconciliation />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/management/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ManagementDashboard />} />
                <Route path="reports" element={<ManagementReports />} />
                <Route path="analytics" element={<ManagementAnalytics />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recovery/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECOVERY]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<RecoveryDashboard />} />
                <Route path="list" element={<RecoveryList />} />
                <Route path="collections" element={<HistoryPage title="Collections History" />} />
                <Route path="tracking" element={<ModulePlaceholder title="Payment Tracking" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-200 space-y-6">
        <h1 className="text-8xl font-display font-black text-red-500 tracking-tighter">403</h1>
        <div className="text-center space-y-2">
            <p className="text-2xl font-bold tracking-tight">Access Denied</p>
            <p className="text-slate-400 font-medium lowercase">you do not have permission to view this section.</p>
        </div>
        <button onClick={() => window.history.back()} className="btn-primary mt-4">Return back</button>
      </div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
