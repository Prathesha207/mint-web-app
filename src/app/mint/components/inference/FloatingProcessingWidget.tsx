"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface FloatingProcessingWidgetProps {
  icon: React.ReactNode;
  color: string;
  className?: string;
  isExpanded: boolean;
  setCollapsedStatus: (value: any) => void;
  processingState: any;
  children: React.ReactNode;
}

export default function FloatingProcessingWidget({
  icon,
  color,
  className = "",
  isExpanded,
  setCollapsedStatus,
  processingState,
  children,
}: FloatingProcessingWidgetProps) {
  const BUTTON_SIZE = 48;
  const EDGE_PADDING = 20;
  const TOP_PADDING = -35;
  const BOTTOM_SAFE_SPACE = 75;
  const PANEL_WIDTH = 320;

  const [corner, setCorner] = useState<Corner>("bottom-left");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: EDGE_PADDING, y: EDGE_PADDING });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!viewport.width || !viewport.height) return;

    switch (corner) {
      case "top-left":
        setPosition({ x: EDGE_PADDING, y: TOP_PADDING });
        break;

      case "top-right":
        setPosition({
          x: viewport.width - BUTTON_SIZE - EDGE_PADDING,
          y: TOP_PADDING,
        });
        break;

      case "bottom-left":
        setPosition({
          x: EDGE_PADDING,
          y: viewport.height - BUTTON_SIZE - BOTTOM_SAFE_SPACE,
        });
        break;

      case "bottom-right":
        setPosition({
          x: viewport.width - BUTTON_SIZE - EDGE_PADDING,
          y: viewport.height - BUTTON_SIZE - BOTTOM_SAFE_SPACE,
        });
        break;
    }
  }, [corner, viewport.width, viewport.height]);

  const POPUP_GAP = 3;

  const popupPosition = useMemo(() => {
    const isLeft = corner.includes("left");
    const isTop = corner.includes("top");

    return {
      left: isLeft ? 0 : "auto",
      right: !isLeft ? 0 : "auto",

      top: isTop ? BUTTON_SIZE + POPUP_GAP : "auto",
      bottom: !isTop ? BUTTON_SIZE + POPUP_GAP : "auto",
    };
  }, [corner]);

  const handleDragEnd = (_: any, info: any) => {
    const x = info.point.x;
    const y = info.point.y;

    const midX = viewport.width / 2;
    const midY = viewport.height / 2;

    let newCorner: Corner;
    if (x < midX && y < midY) newCorner = "top-left";
    else if (x >= midX && y < midY) newCorner = "top-right";
    else if (x < midX && y >= midY) newCorner = "bottom-left";
    else newCorner = "bottom-right";
    setCorner(newCorner);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={{
        left: EDGE_PADDING,
        top: TOP_PADDING,
        right: Math.max(EDGE_PADDING, viewport.width - BUTTON_SIZE - EDGE_PADDING),
        bottom: Math.max(EDGE_PADDING, viewport.height - BUTTON_SIZE - BOTTOM_SAFE_SPACE),
      }}
      onDragEnd={handleDragEnd}
      animate={position}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className="fixed z-200"
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
      }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setCollapsedStatus(isExpanded ? processingState.status : null);
          }}
          className={`flex h-9 w-9 cursor-grab items-center justify-center rounded-full shadow-lg active:cursor-grabbing ${color}`}>
          {icon}
        </button>

        {isExpanded && (
          <div
            className={`absolute ${className}`}
            style={{
              ...popupPosition,
              width: `${PANEL_WIDTH}px`,
              maxWidth: "calc(100vw - 40px)",
              maxHeight: "calc(100vh - 40px)",
            }}
          >
            <div className="overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl">
              {children}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}