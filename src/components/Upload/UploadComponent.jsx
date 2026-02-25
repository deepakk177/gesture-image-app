import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';

const UploadComponent = () => {
    const [isDragging, setIsDragging] = useState(false);
    const setImages = useStore((state) => state.setImages);
    const images = useStore((state) => state.images);

    const processFiles = useCallback((files) => {
        const validFiles = Array.from(files)
            .slice(0, 50) // Max 50 files
            .filter((file) => {
                const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
                const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
                return isValidType && isValidSize;
            });

        if (validFiles.length === 0) return;

        const loaders = validFiles.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_SIZE = 512;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/webp', 0.8));
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(loaders).then((urls) => {
            setImages(urls);
        });
    }, [setImages]);

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const onFileChange = (e) => {
        processFiles(e.target.files);
    };

    return (
        <div className="fixed top-6 left-6 z-20 flex flex-col gap-4">
            {/* Main Upload Trigger */}
            <div className="relative group">
                <label
                    className={`
            glass flex items-center gap-3 px-6 py-3 cursor-pointer transition-all duration-300 
            ${isDragging ? 'bg-white/20 border-white/40 scale-105' : 'hover:bg-white/10 hover:scale-105 inactive:scale-95'}
          `}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={onFileChange}
                    />
                    <Upload className={`w-5 h-5 transition-transform duration-300 ${isDragging ? 'animate-bounce' : 'group-hover:-translate-y-1'}`} />
                    <span className="font-medium">
                        {images.length > 0 ? `${images.length} Images Loaded` : 'Upload Textures'}
                    </span>
                </label>
            </div>

            {/* Validation Specs (Mini) */}
            <div className="glass px-4 py-2 flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                <span>JPG, PNG, WEBP • MAX 5MB • MAX 50</span>
            </div>

            {/* Preview Strip (Ghostly) */}
            {images.length > 0 && (
                <div className="flex gap-2 p-2 glass max-w-xs overflow-x-auto no-scrollbar animate-in slide-in-from-left-4 duration-500">
                    {images.slice(0, 5).map((url, i) => (
                        <div key={i} className="w-10 h-10 flex-shrink-0 rounded-md overflow-hidden border border-white/10">
                            <img src={url} alt="" className="w-full h-full object-cover opacity-60" />
                        </div>
                    ))}
                    {images.length > 5 && (
                        <div className="w-10 h-10 flex-shrink-0 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold">
                            +{images.length - 5}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadComponent;
