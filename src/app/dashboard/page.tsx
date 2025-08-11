import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Dashboard } from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Dashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
