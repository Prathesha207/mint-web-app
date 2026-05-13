import { useRef, useCallback } from 'react';
import { showToast } from '../lib/toast';
import toast from 'react-hot-toast';

interface CameraShutterVerificationOptions {
  sampleIntervalMs?: number;
  changeThresholdPercent?: number;
  pixelChangeThreshold?: number;
  frameWidth?: number;
  frameHeight?: number;
}

export function useCameraShutterDetection() {
  const getFrameData = useCallback(
    (videoElement: HTMLVideoElement, frameWidth: number, frameHeight: number): Uint8ClampedArray | null => {
      if (!videoElement) return null;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = frameWidth;
      tempCanvas.height = frameHeight;

      const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      try {
        ctx.drawImage(videoElement, 0, 0, frameWidth, frameHeight);
        const imageData = ctx.getImageData(0, 0, frameWidth, frameHeight);
        return imageData.data;
      } catch {
        return null;
      }
    },
    []
  );

  const verifyLiveSignal = useCallback(
    async (
      videoElement: HTMLVideoElement,
      options: CameraShutterVerificationOptions = {}
    ): Promise<boolean> => {
      const {
        sampleIntervalMs = 100,
        changeThresholdPercent = 0.5,
        pixelChangeThreshold = 1,
        frameWidth = 40,
        frameHeight = 30,
      } = options;

      try {
        if (!videoElement || !videoElement.srcObject) {
          return true;
        }

        if (videoElement.readyState < 2) {
          return true;
        }

        const frame1 = getFrameData(videoElement, frameWidth, frameHeight);
        if (!frame1) return true;

        await new Promise((resolve) => setTimeout(resolve, sampleIntervalMs));

        const frame2 = getFrameData(videoElement, frameWidth, frameHeight);
        if (!frame2) return true;

        let differences = 0;
        const sampleSize = Math.min(frame1.length, 400);

        for (let i = 0; i < sampleSize; i += 4) {
          const rDiff = Math.abs(frame1[i] - frame2[i]);
          const gDiff = Math.abs(frame1[i + 1] - frame2[i + 1]);
          const bDiff = Math.abs(frame1[i + 2] - frame2[i + 2]);

          if (
            rDiff > pixelChangeThreshold ||
            gDiff > pixelChangeThreshold ||
            bDiff > pixelChangeThreshold
          ) {
            differences++;
          }
        }

        const pixelCount = sampleSize / 4;
        const changePercentage = (differences / pixelCount) * 100;

        return changePercentage > changeThresholdPercent;
      } catch {
        return true;
      }
    },
    [getFrameData]
  );

  const verifyCameraBeforeAction = useCallback(
    async (
      videoElement: HTMLVideoElement | null,
      action: 'training' | 'inference' | 'recording',
      options: CameraShutterVerificationOptions = {}
    ): Promise<boolean> => {
      if (!videoElement) {
        showToast('Camera not ready', 'error');
        return false;
      }

      // const toastId = toast.loading('Checking camera...', {
      //   id: 'camera-verify',
      // });

      try {
        const isLive = await verifyLiveSignal(videoElement, options);

        if (!isLive) {

          showToast(`Enable video stream to start ${action}`, 'error');
          return false;
        }


        showToast(`Video Straem Enabled. Starting ${action}`, 'success');
        return true;
      } catch (error) {
        showToast('Please connect  camera first', 'warning');
        return true;
      }
    },
    [verifyLiveSignal]
  );

  return {
    verifyLiveSignal,
    verifyCameraBeforeAction,
  };
}