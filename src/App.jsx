import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import GlobeScene from './components/Globe/GlobeScene';
import Instructions from './components/UI/Instructions';
import UploadComponent from './components/Upload/UploadComponent';
import WebcamPreview from './components/Gesture/WebcamPreview';

function App() {
  return (
    <div className="relative w-screen h-screen bg-[#010101] overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UploadComponent />
      <Instructions />
      <WebcamPreview />

      {/* Footer Branding */}
      <div className="fixed bottom-6 left-6 pointer-events-none">
        <h1 className="text-2xl font-black tracking-tighter text-white/20 uppercase">
          Gesture Globe
        </h1>
        <p className="text-[10px] font-medium text-white/10 uppercase tracking-[0.2em]">
          Powered by MediaPipe & Three.js
        </p>
      </div>
    </div>
  );
}

export default App;
