'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/services/api/auth';
import { useAuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className }: GoogleLoginButtonProps) {
  const { t } = useTranslation('auth');
  const { login } = useAuthContext();
  const { googleLoginMutation } = useAuth();

  const handleGoogleLogin = async (response: any) => {
    try {
      const result = await googleLoginMutation.mutateAsync({
        token: response.credential,
      });
      login(result.data.token, result.data.user);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleLogin,
      });

      google.accounts.id.renderButton(document.getElementById('google-login-button')!, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  }, []);

  return (
    <div id="google-login-button" className={className}>
      <Button
        variant="outline"
        className="w-full"
        disabled={googleLoginMutation.isPending}
      >
        {googleLoginMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {t('login.googleButton')}
      </Button>
    </div>
  );
}