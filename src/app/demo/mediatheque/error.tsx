'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MediathequeDemoError({ error, reset }: Props) {
  useEffect(() => {
    console.error('Démo médiathèque error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center"
    >
      <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        La démo de la médiathèque n&apos;a pas pu se charger. Réessayez ou rechargez la page.
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
