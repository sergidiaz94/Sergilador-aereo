'use client';

import { useState } from 'react';
import { OlgaAuthForm } from './olga-auth-form';
import { OlgaResult } from './olga-result';
import { useOlgaSearch } from '@/hooks/use-olga-search';

export function OlgaPanel() {
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { mutate, data, isPending } = useOlgaSearch();

  const handlePasswordSubmit = (password: string) => {
    mutate(password, {
      onSuccess: (result) => {
        if (result.ok) {
          setUnlocked(true);
          setAuthError(false);
        } else {
          setAuthError(true);
        }
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-pink-950/10 to-slate-900 border border-pink-800/30 rounded-2xl p-6 shadow-2xl max-w-xl mx-auto">
      {!unlocked ? (
        <OlgaAuthForm onSubmit={handlePasswordSubmit} error={authError} loading={isPending} />
      ) : (
        <OlgaResult loading={isPending} nextDays={data?.nextDays} cheapestOverall={data?.cheapestOverall} />
      )}
    </div>
  );
}
