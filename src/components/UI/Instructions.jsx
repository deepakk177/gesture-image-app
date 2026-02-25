import React from 'react';

const Instructions = () => {
    return (
        <div className="fixed top-6 right-6 w-80 glass p-6 pointer-events-none animate-in fade-in slide-in-from-right-4 duration-700">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Gesture Controls
            </h2>
            <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shadow-[0_0_8px_#6366f1]" />
                    <span>Move hand <span className="text-indigo-400 font-semibold">left/right</span> to rotate the globe.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shadow-[0_0_8px_#a855f7]" />
                    <span><span className="text-purple-400 font-semibold">Pinch</span> fingers to zoom out.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shadow-[0_0_8px_#ec4899]" />
                    <span><span className="text-pink-400 font-semibold">Release</span> pinch to zoom back in.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_#10b981]" />
                    <span>Keep your hand <span className="text-emerald-400 font-semibold">steady and open</span> to stop rotation.</span>
                </li>
            </ul>
        </div>
    );
};

export default Instructions;
