import { create } from 'zustand'

export const useStore = create((set) => ({
    images: [],
    rotation: { x: 0, y: 0 },
    zoom: 1,
    rotationVelocity: { x: 0, y: 0.005 }, // Initial slow rotation
    gestureState: {
        handPresent: false,
        palmX: 0,
        palmY: 0,
        isPinching: false,
        lastX: null,
    },

    setImages: (images) => set({ images }),
    setRotation: (rotation) => set((state) => ({
        rotation: typeof rotation === 'function' ? rotation(state.rotation) : rotation
    })),
    setZoom: (zoom) => set((state) => ({
        zoom: typeof zoom === 'function' ? zoom(state.zoom) : zoom
    })),
    setRotationVelocity: (velocity) => set((state) => ({
        rotationVelocity: typeof velocity === 'function' ? velocity(state.rotationVelocity) : velocity
    })),
    updateGesture: (update) => set((state) => ({
        gestureState: { ...state.gestureState, ...update }
    })),
}))
