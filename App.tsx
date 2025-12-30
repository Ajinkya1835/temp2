
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ReportViolation } from './pages/ReportViolation';
import { OfficerInspections } from './pages/OfficerInspections';
import { Login } from './pages/Login';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-sm font-bold tracking-widest uppercase">System Initializing...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  
  // Case-insensitive role check for robustness
  if (roles) {
    const userRoleLower = user.role.toLowerCase();
    const hasRole = roles.some(r => r.toLowerCase() === userRoleLower);
    if (!hasRole) return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <Router>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportViolation /></ProtectedRoute>} />
          <Route path="/inspections" element={
            <ProtectedRoute roles={['Municipal_Officer', 'Super_Admin']}>
              <OfficerInspections />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
