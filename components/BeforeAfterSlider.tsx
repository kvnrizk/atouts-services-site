"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  /** Overrides the default card sizing (aspect ratio, rounding, shadow). */
  className?: string;
  /** Load images eagerly — use when the slider is above the fold (hero). */
  priority?: boolean;
  sizes?: string;
  /** Vertical position of the AVANT/APRÈS labels, e.g. to clear a header overlapping the slider. */
  labelsTopClass?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  className = "aspect-[4/3] rounded-xl shadow-lg",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  labelsTopClass = "top-4",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden cursor-col-resize select-none touch-pan-y ${className}`}
      onMouseDown={(e) => {
        isDragging.current = true;
        updatePosition(e.clientX);
      }}
      onMouseMove={(e) => isDragging.current && updatePosition(e.clientX)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
      role="slider"
      tabIndex={0}
      aria-label={`Comparer avant et après : ${title}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      onKeyDown={handleKeyDown}
    >
      {/* After image (full) */}
      <Image
        src={afterImage}
        alt={`${title} - Après`}
        fill
        className="object-cover"
        draggable={false}
        sizes={sizes}
        priority={priority}
      />

      {/* Before image, clipped from the right so both images share the same framing */}
      <Image
        src={beforeImage}
        alt={`${title} - Avant`}
        fill
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        draggable={false}
        sizes={sizes}
        priority={priority}
      />

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-sky-400 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-sky-400 rounded-full shadow-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6 4L2 10L6 16" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 4L18 10L14 16" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className={`absolute ${labelsTopClass} left-4 bg-neutral-950/70 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider pointer-events-none`}>
        AVANT
      </div>
      <div className={`absolute ${labelsTopClass} right-4 bg-sky-400 text-neutral-950 px-3 py-1 rounded-md text-xs font-bold tracking-wider pointer-events-none`}>
        APRÈS
      </div>
    </div>
  );
}
