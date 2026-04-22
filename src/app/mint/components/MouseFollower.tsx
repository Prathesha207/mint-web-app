'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function MouseFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });

  const dotSpeed = 0.15;
  const ringSpeed = 0.08;
  const trailSpeed = 0.06;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }, []);

  useEffect(() => {
    if (!followerRef.current) return;

    followerRef.current.style.opacity = '1';

    const animate = () => {
      // Fast dot
      dot.current.x += (mouse.current.x - dot.current.x) * dotSpeed;
      dot.current.y += (mouse.current.y - dot.current.y) * dotSpeed;

      // Medium ring
      ring.current.x += (mouse.current.x - ring.current.x) * ringSpeed;
      ring.current.y += (mouse.current.y - ring.current.y) * ringSpeed;

      // Slow trail
      trail.current.x += (mouse.current.x - trail.current.x) * trailSpeed;
      trail.current.y += (mouse.current.y - trail.current.y) * trailSpeed;

      // Update DOM
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x}px, ${trail.current.y}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Hide on touch
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (followerRef.current) {
        followerRef.current.style.display = 'none';
      }
    }
  }, []);

  return (
    <div
      ref={followerRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: 0 }}
    >
      {/* Fast Blue Dot */}
      <div
        ref={dotRef}
        className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Medium Ring */}
      <div
        ref={ringRef}
        className="absolute w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg z-40 mix-blend-screen "
        style={{ transform: 'translate(-50%, -50%) scale(0.7)' }}
      />

      {/* Slow Outer Trail */}
      <div
        ref={trailRef}
        className="absolute w-8 h-8 border-2 border-blue-400/50 rounded-full opacity-70 transition-transform duration-100 ease-out z-30 mix-blend-screen"
        style={{ transform: 'translate(-50%, -50%) scale(0.6)' }}
      />
    </div>
  );
}

