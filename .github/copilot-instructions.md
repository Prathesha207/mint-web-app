# Copilot Instructions for DIME Frontend

## Project Overview
- **DIME** is an industrial AI platform for anomaly detection and quality inspection, built with Next.js (App Router) and TypeScript.
- The app supports model training, inference, and monitoring for computer vision tasks, with a focus on real-time and mobile camera integration.
- Major UI/logic is in `src/app/` (pages, API routes) and `src/components/` (feature modules like Inference, Training, Dashboard).

## Architecture & Data Flow
- **Training and Inference**: Key flows are in `src/components/Inference.tsx` and `src/app/training/page.tsx`. These handle model selection, ROI drawing, live video/camera input, and backend communication.
- **Backend Integration**: Uses REST APIs (see `NEXT_PUBLIC_API_URL` in `next.config.ts`) and WebSockets for real-time video/inference. Mobile and desktop clients connect via signaling endpoints (`src/app/api/signaling/route.ts`).
- **State & Patterns**: React hooks and context are used for state. Terminal logs, model info, and camera sessions are managed in local state. UI feedback (logs, status, instructions) is prominent.
- **PWA/Service Worker**: Registered in `src/app/layout.tsx` for offline and mobile support.

## Developer Workflows
- **Start Dev Server**: `npm run dev` (see README.md)
- **Build for Production**: `npm run build`
- **Lint**: `npm run lint` (uses `eslint.config.mjs`)
- **Environment**: Set variables in `process.env` or `next.config.ts` (`NEXT_PUBLIC_*` for frontend usage).
- **Component Hot Reload**: Edit files in `src/app/` or `src/components/` for instant updates.

## Project-Specific Conventions
- **Model/Camera Types**: Shared interfaces (e.g., `ROI`, `CameraDevice`, `ModelInfo`) are defined in multiple files—keep them in sync or centralize in `src/types/`.
- **Terminal/Log UI**: Use the provided log/terminal patterns for user feedback (see `Inference.tsx`).
- **Instructional UI**: Each major feature (Training, Inference) provides step-by-step instructions in the UI—maintain this pattern for new features.
- **Mobile Camera**: QR code and signaling logic for remote camera sessions are in `Inference.tsx` and `training/page.tsx`.
- **API Endpoints**: Use `/api/signaling` for WebRTC signaling; backend inference endpoints are set via env/config.

## Integration & External Dependencies
- **WebRTC/Signaling**: Custom signaling server logic in `src/app/api/signaling/route.ts`.
- **FFmpeg**: Used in training for video processing (`@ffmpeg/ffmpeg`).
- **Syntax Highlighting**: Uses `react-syntax-highlighter` for code blocks.
- **Fonts**: Uses `next/font` for Geist fonts.

## Examples
- See `src/components/Inference.tsx` for: model download, usage instructions, log/terminal UI, mobile camera QR logic.
- See `src/app/training/page.tsx` for: ROI drawing, video input, training workflow, logs.
- See `src/app/api/signaling/route.ts` for: signaling protocol and debug endpoint.

## Tips
- Always provide clear user feedback (logs, status, instructions) in UI components.
- When adding new device/model types, update shared interfaces and keep UI/logic consistent.
- For new API integrations, follow the REST/WebSocket patterns in Inference and Training modules.
