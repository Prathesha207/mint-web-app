// app/mobile-camera/page.tsx
import MobileCameraClient from '@/components/MobileCameraClient';
import { Suspense } from 'react';


export default function MobileCameraPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">
      Opening remote camera…
    </div>}>
      <MobileCameraClient />
    </Suspense>
  );
}
