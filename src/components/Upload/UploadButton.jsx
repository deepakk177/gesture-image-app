import React from 'react';
import { Upload } from 'lucide-react';

const UploadButton = () => {
    return (
        <div className="fixed top-6 left-6 z-10">
            <button className="glass flex items-center gap-3 px-6 py-3 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 group">
                <Upload className="w-5 h-5 text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-all" />
                <span className="font-medium text-white/90">Upload Texture</span>
            </button>
        </div>
    );
};

export default UploadButton;
