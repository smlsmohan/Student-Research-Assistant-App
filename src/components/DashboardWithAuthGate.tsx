'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export function DashboardWithAuthGate() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { user } = useAuth();

  const handleAuthRequired = (action: string) => {
    if (!user) {
      setShowAuthModal(true);
      // Set default tab based on action context
      setAuthTab('register'); // Encourage registration for new users
      return false;
    }
    return true;
  };

  return (
    <>
      <Dashboard 
        onAuthRequired={handleAuthRequired}
        isAuthenticated={!!user}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </>
  );
}
