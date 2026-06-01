'use client';

import { Inbox } from '@novu/nextjs';
import { useAuthStore } from '@/store/useAuthStore';

export default function NotificationInbox() {
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
  const supplierId = useAuthStore((state) => state.user?.supplierId);

  if (!supplierId || !applicationIdentifier) {
    return null;
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={String(supplierId)}
      appearance={{
        variables: {
          colorPrimary: '#2663EB',
          colorPrimaryForeground: '#FFFFFF',
          colorSecondary: '#ec4899',
          colorSecondaryForeground: '#FFFFFF',
          colorBackground: '#FFFFFF',
          colorForeground: '#232325',
          colorNeutral: '#D4D4D8',
          colorShadow: 'rgba(0, 0, 0, 0.08)',
          fontSize: '14px',
        },
        elements: {
          bellIcon: {
            color: '#71717A',
          },
        },
      }}
    />
  );
}
