'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth-context';
import { storage } from '@/lib/storage';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  requireComplete?: boolean;
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireGuest = false,
  requireComplete = false,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isRegistrationComplete, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    // Save current page for redirect after login
    if (requireAuth && !isAuthenticated) {
      storage.setPreviousPage(pathname);
      router.push('/auth/login');
      return;
    }

    // Redirect authenticated users away from auth pages
    if (requireGuest && isAuthenticated) {
      const redirectTo = storage.getPreviousPage() || '/';
      storage.clearPreviousPage();
      router.push(redirectTo);
      return;
    }

    // Redirect incomplete registrations to complete profile
    if (requireComplete && isAuthenticated && !isRegistrationComplete) {
      router.push('/auth/complete-registration');
      return;
    }
  }, [isAuthenticated, isRegistrationComplete, isLoading, pathname, router, requireAuth, requireGuest, requireComplete]);

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Show children only if all conditions are met
  if (
    (!requireAuth || isAuthenticated) &&
    (!requireGuest || !isAuthenticated) &&
    (!requireComplete || (isAuthenticated && isRegistrationComplete))
  ) {
    return <>{children}</>;
  }

  return null;
}