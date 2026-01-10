import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Halaman tidak ditemukan</p>
        <p className="text-gray-500 mt-2">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home className="w-4 h-4" />
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
