'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthSessionProvider({ children }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
