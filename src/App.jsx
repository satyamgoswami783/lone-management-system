import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import ModulePlaceholder from './pages/shared/ModulePlaceholder';
import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import LoanApplication from './pages/applicant/LoanApplication';
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

import MyStatus from './pages/applicant/MyStatus';
import Statements from './pages/applicant/Statements';
import VerificationQueue from './pages/hr/VerificationQueue';
import CreditQueue from './pages/credit/CreditQueue';
import PayoutQueue from './pages/finance/PayoutQueue';
import ApplicationsPipeline from './pages/admin/ApplicationsPipeline';
import ManagementReports from './pages/management/ManagementReports';
import RecoveryList from './pages/recovery/RecoveryList';
import HistoryPage from './pages/shared/HistoryPage';
import UserManagement from './pages/admin/UserManagement';
import Reconciliation from './pages/finance/Reconciliation';
import DocumentsCenter from './pages/applicant/DocumentsCenter';
import Profile from './pages/shared/Profile';
import ApplicationFullView from './pages/applicant/ApplicationFullView';
import HRVerificationDetail from './pages/hr/HRVerificationDetail';
import HREmployees from './pages/hr/HREmployees';
import HRReports from './pages/hr/HRReports';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import CreditProfilePage from './pages/credit/CreditProfilePage';
import RiskReviews from './pages/credit/RiskReviews';
import RecoveryCaseDetail from './pages/recovery/RecoveryCaseDetail';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-display text-2xl">Registration Page</div>} />
      
      {/* Role-Based Protected Routes */}
      <Route
        path="/applicant/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ApplicantDashboard />} />
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
                <Route path="profile/:id" element={<CreditProfilePage />} />
                <Route path="reviews" element={<RiskReviews />} />
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
                <Route path="analytics" element={<ModulePlaceholder title="Executive Analytics" />} />
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
                <Route path="case/:id" element={<RecoveryCaseDetail />} />
                <Route path="collections" element={<HistoryPage title="Collections History" />} />
                <Route path="tracking" element={<ModulePlaceholder title="Payment Tracking" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-6xl font-display font-bold text-red-500">403</h1>
        <p className="text-xl text-slate-400">Access Denied: You do not have permission to view this page.</p>
        <button onClick={() => window.history.back()} className="btn-primary">Go Back</button>
      </div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
