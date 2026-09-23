import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import Landing from './pages/public/Landing';
import HowItWorks from './pages/public/HowItWorks';
import Technology from './pages/public/Technology';
import Stakeholders from './pages/public/Stakeholders';
import About from './pages/public/About';
import Verify from './pages/public/Verify';
import Login from './pages/public/Login';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Batches from './pages/dashboard/Batches';
import BatchDetail from './pages/dashboard/BatchDetail';
import IoTMonitoring from './pages/dashboard/IoTMonitoring';
import Blockchain from './pages/dashboard/Blockchain';
import QRCode from './pages/dashboard/QRCode';
import Alerts from './pages/dashboard/Alerts';
import Analytics from './pages/dashboard/Analytics';
import Users from './pages/dashboard/Users';
import Settings from './pages/dashboard/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/stakeholders" element={<Stakeholders />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Public QR Verification (no layout chrome) */}
      <Route path="/verify" element={<Verify />} />
      <Route path="/verify/:batchId" element={<Verify />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="batches" element={<Batches />} />
        <Route path="batches/:batchId" element={<BatchDetail />} />
        <Route path="iot" element={<IoTMonitoring />} />
        <Route path="blockchain" element={<Blockchain />} />
        <Route path="qr" element={<QRCode />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
