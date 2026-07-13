'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OlgaAuthForm } from './olga-auth-form';
import { OlgaResult } from './olga-result';
import { useOlgaSearch } from '@/hooks/use-olga-search';

type Props = { open: boolean; onClose: () => void };

export function OlgaModal({ open, onClose }: Props) {
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

  const handleClose = () => {
    onClose();
    setUnlocked(false);
    setAuthError(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 border border-pink-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1 rounded-lg"
            >
              Tancar
            </button>

            {!unlocked ? (
              <OlgaAuthForm onSubmit={handlePasswordSubmit} error={authError} loading={isPending} />
            ) : (
              <OlgaResult loading={isPending} offer={data?.offer} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
