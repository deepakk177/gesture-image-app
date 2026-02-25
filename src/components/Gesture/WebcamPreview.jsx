import React, { useRef, useEffect, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { Loader2, CameraOff } from 'lucide-react';
import { useStore } from '../../store/useStore';

const WebcamPreview = () => {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const gestureState = useStore((state) => state.gestureState);
    const updateGesture = useStore((state) => state.updateGesture);
    const setRotationVelocity = useStore((state) => state.setRotationVelocity);
    const setZoom = useStore((state) => state.setZoom);

    useEffect(() => {
        if (!videoRef.current) return;

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        let lastX = null;
        let lastTimestamp = 0;
        const UPDATE_FREQUENCY = 1000 / 30; // 30Hz Throttling (Phase 9)

        hands.onResults((results) => {
            const now = performance.now();
            if (now - lastTimestamp < UPDATE_FREQUENCY) return;
            lastTimestamp = now;

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                const palmCenter = landmarks[9];

                // 1. Pinch Detection
                const distance = Math.sqrt(
                    Math.pow(thumbTip.x - indexTip.x, 2) +
                    Math.pow(thumbTip.y - indexTip.y, 2)
                );
                const isPinching = distance < 0.05;

                // 2. Rotation Detection (X Movement)
                const currentX = palmCenter.x;
                let dx = 0;
                if (lastX !== null) {
                    dx = currentX - lastX;
                }
                lastX = currentX;

                // 3. Jitter Prevention & Stop Condition (Phase 7)
                const JITTER_THRESHOLD = 0.003;
                const isStable = Math.abs(dx) < JITTER_THRESHOLD;

                // Update Store
                updateGesture({
                    handPresent: true,
                    palmX: currentX,
                    palmY: palmCenter.y,
                    isPinching,
                });

                // Apply Actions
                if (isPinching) {
                    setZoom((prev) => Math.max(0.4, prev - 0.03));
                } else {
                    setZoom((prev) => Math.min(1.2, prev + 0.015));
                }

                if (!isPinching && !isStable) {
                    // Sensitivity scaling
                    setRotationVelocity((prev) => ({
                        x: prev.x,
                        y: dx * 0.4
                    }));
                } else if (isStable && !isPinching) {
                    setRotationVelocity({ x: 0, y: 0 });
                }

            } else {
                updateGesture({ handPresent: false });
                lastX = null;
            }
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (isLoading) setIsLoading(false);
                await hands.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
        });

        camera.start().catch(() => {
            setHasError(true);
            setIsLoading(false);
        });

        return () => {
            camera.stop();
            hands.close();
        };
    }, [updateGesture, setRotationVelocity, setZoom, isLoading]);

    return (
        <div className="fixed bottom-6 right-6 w-64 h-48 glass overflow-hidden border-2 border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${isLoading || hasError ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Loading State (Phase 10) */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Initialising AI Hub</span>
                </div>
            )}

            {/* Error/Permission State (Phase 10) */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-md gap-3 p-6 text-center">
                    <CameraOff className="w-8 h-8 text-red-500/50" />
                    <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest leading-relaxed">
                        Camera Access Denied or Module Failure
                    </span>
                </div>
            )}

            {!isLoading && !hasError && (
                <>
                    <div className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-white/90">Gesture Engine V2</span>
                    </div>

                    {/* Status Indicators */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-xl border border-white/5">
                        <div className="flex gap-2.5">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${gestureState.handPresent ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] scale-125' : 'bg-white/10'}`} />
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${gestureState.isPinching ? 'bg-purple-500 shadow-[0_0_10px_#a855f7] scale-125' : 'bg-white/10'}`} />
                        </div>
                        <span className="text-[8px] text-white/50 uppercase font-black tracking-widest">Active Tracking</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default WebcamPreview;
