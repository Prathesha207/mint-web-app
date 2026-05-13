'use client';

import { Suspense, useState, useEffect } from 'react';
import Loading from '@/components/loading';
import dynamic from 'next/dynamic';

// Dynamically import the InferenceClientPage with no SSR
const InferenceClientPageDynamic = dynamic(
  () => import('@/components/Inference'),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

// Client-side only wrapper component
function InferenceClientPageWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-400">Loading inference interface...</div>
        </div>
      </div>
    );
  }

  return <InferenceClientPageDynamic />;
}

export default function InferencePage() {
  return (
    <Suspense fallback={<Loading />}>
      <InferenceClientPageWrapper />
    </Suspense>
  );
}