import { useCallback, useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';

interface UseGestureControlReturn {
  isEnabled: boolean;
  toggleGesture: () => void;
  direction: 'left' | 'right' | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useGestureControl = (): UseGestureControlReturn => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const lastXRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  const detectGesture = useCallback((results: Results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }

    const wrist = results.multiHandLandmarks[0][0];
    const currentX = wrist.x * window.innerWidth;

    if (lastXRef.current !== 0) {
      const diff = currentX - lastXRef.current;
      const threshold = 150;

      if (diff > threshold) {
        setDirection('right');
        setTimeout(() => setDirection(null), 500);
      } else if (diff < -threshold) {
        setDirection('left');
        setTimeout(() => setDirection(null), 500);
      }
    }

    lastXRef.current = currentX;
  }, []);

  const initHands = useCallback(async () => {
    if (!videoRef.current) return;

    handsRef.current = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handsRef.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handsRef.current.onResults(detectGesture);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });

    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play();
    };
  }, [detectGesture]);

  const processVideo = useCallback(() => {
    if (!videoRef.current || !handsRef.current || !isEnabled) return;

    handsRef.current.send({ image: videoRef.current });
    animationRef.current = requestAnimationFrame(processVideo);
  }, [isEnabled]);

  useEffect(() => {
    const video = videoRef.current;

    if (isEnabled) {
      initHands();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      handsRef.current = null;
      lastXRef.current = 0;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isEnabled, initHands]);

  useEffect(() => {
    if (isEnabled && videoRef.current?.readyState === 4) {
      animationRef.current = requestAnimationFrame(processVideo);
    }
  }, [isEnabled, processVideo]);

  const toggleGesture = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  return {
    isEnabled,
    toggleGesture,
    direction,
    videoRef,
  };
};
