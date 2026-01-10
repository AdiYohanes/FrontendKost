'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-600 mt-2">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto">
            {error.message}
          </pre>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Home className="w-4 h-4" />
            Kembali ke Home
          </a>
        </div>
      </div>
    </div>
  );
}
