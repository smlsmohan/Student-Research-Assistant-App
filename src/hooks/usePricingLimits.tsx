'use client';

import { useState, useEffect } from 'react';

type PricingTier = 'free' | 'monthly' | 'annual';

interface UserPlan {
  tier: PricingTier;
  searchesUsed: number;
  searchLimit: number;
  expiryDate?: Date;
}

export function usePricingLimits() {
  const [userPlan, setUserPlan] = useState<UserPlan>({
    tier: 'free',
    searchesUsed: 0,
    searchLimit: 5,
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedPlan = localStorage.getItem('userPlan');
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan);
      // Check if plan is expired
      if (parsed.expiryDate && new Date(parsed.expiryDate) < new Date()) {
        // Reset to free plan if expired
        const resetPlan = { tier: 'free', searchesUsed: 0, searchLimit: 5 };
        setUserPlan(resetPlan);
        localStorage.setItem('userPlan', JSON.stringify(resetPlan));
      } else {
        setUserPlan(parsed);
      }
    }
  }, []);

  const canPerformSearch = (): boolean => {
    if (userPlan.tier !== 'free') return true;
    return userPlan.searchesUsed < userPlan.searchLimit;
  };

  const incrementSearchCount = (): boolean => {
    if (!canPerformSearch()) {
      setShowUpgradeModal(true);
      return false;
    }

    const newPlan = {
      ...userPlan,
      searchesUsed: userPlan.searchesUsed + 1,
    };
    
    setUserPlan(newPlan);
    localStorage.setItem('userPlan', JSON.stringify(newPlan));
    
    // Show upgrade modal if reaching limit
    if (newPlan.tier === 'free' && newPlan.searchesUsed >= newPlan.searchLimit) {
      setTimeout(() => setShowUpgradeModal(true), 1000);
    }
    
    return true;
  };

  const upgradePlan = (tier: PricingTier) => {
    const newPlan: UserPlan = {
      tier,
      searchesUsed: 0,
      searchLimit: tier === 'free' ? 5 : Infinity,
      expiryDate: tier === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : tier === 'annual' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 days
        : undefined,
    };
    
    setUserPlan(newPlan);
    localStorage.setItem('userPlan', JSON.stringify(newPlan));
    setShowUpgradeModal(false);
  };

  const resetToFree = () => {
    const resetPlan = { tier: 'free' as PricingTier, searchesUsed: 0, searchLimit: 5 };
    setUserPlan(resetPlan);
    localStorage.setItem('userPlan', JSON.stringify(resetPlan));
  };

  return {
    userPlan,
    canPerformSearch,
    incrementSearchCount,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradePlan,
    resetToFree,
  };
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: PricingTier) => void;
  searchesUsed: number;
  searchLimit: number;
}

export function UpgradeModal({ isOpen, onClose, onUpgrade, searchesUsed, searchLimit }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Free Plan Limit Reached
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You've used {searchesUsed} of {searchLimit} free searches. Upgrade to continue exploring research opportunities!
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => onUpgrade('monthly')}
            className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <div className="text-left">
              <div className="font-semibold text-blue-600 dark:text-blue-400">Monthly Pro - €5/month</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unlimited searches + premium features</div>
            </div>
          </button>

          <button
            onClick={() => onUpgrade('annual')}
            className="w-full p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <div className="text-left">
              <div className="font-semibold text-purple-600 dark:text-purple-400">Annual Pro - €50/year</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Save €10/year + all premium features</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
