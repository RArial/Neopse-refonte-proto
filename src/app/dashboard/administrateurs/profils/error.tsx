'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfilsError({ error, reset }: Props) {
  useEffect(() => {
    console.error('Profils error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center"
    >
      <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Les profils n&apos;ont pas pu se charger. Réessayez ou contactez le support si le problème persiste.
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
