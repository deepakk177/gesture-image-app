# Gesture Globe

A premium, interactive 3D globe visualization powered by AI hand gestures. Upload your photos and watch them dance in a holographic sphere controlled by your hands.

## ✨ Features

- **🦾 AI Gesture Hub**: Real-time hand tracking using MediaPipe Hands.
- **🌍 Holographic Globe**: Fibonacci-distributed image planes on a smooth rotating sphere.
- **📸 Intelligent Upload**: Drag & drop up to 50 images with auto-resizing (512px) for 60FPS performance.
- **✨ Physics-Based Interaction**: Supports inertia, damping, and smooth lerped animations.
- **💎 Glassmorphism UI**: High-end aesthetic with frosted glass, gradients, and micro-animations.

## 🖐️ Gesture Guide

| Gesture | Action | Result |
| :--- | :--- | :--- |
| **Move Hand Left/Right** | Rotation | Spins the globe horizontally |
| **Pinch (Thumb + Index)** | Zoom Out | Shrinks the globe away from you |
| **Release Pinch** | Zoom In | Brings the globe back to focus |
| **Open Hand Steady** | Stop | Halts all rotation instantly |

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 7
- **3D Engine**: Three.js + @react-three/fiber + @react-three/drei
- **AI/ML**: MediaPipe Hands
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Animations**: Framer Motion

## 🚀 Getting Started

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔒 Security Requirements

- **HTTPS Required**: The application requires a secure context (HTTPS) or `localhost` to access the webcam for gesture detection.
- **Camera Permission**: Grant camera access to enable the AI gesture engine.

---
Built with ❤️ by Antigravity
