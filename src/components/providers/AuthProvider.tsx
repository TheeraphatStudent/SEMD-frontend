'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

function AuthSessionBridge() {
  const { data: session, status } = useSession();
  const hasSyncedSession = useRef(false);
  const { checkAuth, syncExternalSession } = useAuth();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken || hasSyncedSession.current) {
      return;
    }

    hasSyncedSession.current = true;
    void syncExternalSession(session.accessToken, session.refreshToken ?? null).catch(() => {
      hasSyncedSession.current = false;
    });
  }, [session?.accessToken, session?.refreshToken, status, syncExternalSession]);

  return null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthSessionBridge />
      {children}
    </SessionProvider>
  );
}
