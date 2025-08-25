"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="text-yellow-500 w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg mb-2">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <p className="text-sm text-gray-500 mb-6">Error code: 404</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
