'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  Settings, 
  BookmarkIcon,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/auth/login">
            Sign In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">
            Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">
            {profile?.full_name ? getInitials(profile.full_name) : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">
            {profile?.full_name || 'User'}
          </div>
          <div className="text-xs text-muted-foreground">
            {user.email}
          </div>
        </div>
        
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 theme-card border theme-border shadow-lg rounded-lg py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {profile?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  {profile?.institution && (
                    <div className="text-xs text-muted-foreground">
                      {profile.institution}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/auth/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile Settings
              </Link>
              
              <Link
                href="/bookmarks"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BookmarkIcon className="h-4 w-4" />
                My Bookmarks
              </Link>
              
              <div className="border-t border-border my-2" />
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors w-full text-left text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
