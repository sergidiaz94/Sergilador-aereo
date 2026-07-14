'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';

type Props = { onSubmit: (password: string) => void; error: boolean; loading: boolean };

export function OlgaAuthForm({ onSubmit, error, loading }: Props) {
  const [password, setPassword] = useState('');

  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-pink-400">
        <KeyRound className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-white mb-1">{"Cerca Directa Vol d'Anada l'Olga"}</h3>
      <p className="text-xs text-slate-400 mb-6">
        {"Posa la contrasenya per buscar el vol més barat d'anada cap a BCN en els pròxims 3 dies."}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(password);
        }}
        className="max-w-xs mx-auto space-y-3"
      >
        <input
          type="password"
          placeholder="Contrasenya..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-pink-300 text-sm focus:outline-none focus:border-pink-500"
        />
        {error && <p className="text-xs text-red-400 font-semibold">Incorrecte. Recorda el sentiment perico!</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-pink-500/20 disabled:opacity-50"
        >
          {loading ? 'Comprovant...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
