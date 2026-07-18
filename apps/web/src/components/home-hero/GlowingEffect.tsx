// Aceternity-style border glow (ui.aceternity.com/components/glowing-effect).
// Supports continuous auto-orbit around the perimeter, or pointer tracking.
// Warm amber palette aligned with Artifact OS design tokens.
//
// Performance: auto orbit uses CSS @property animation (not JS setProperty
// every frame). Orbit pauses while the page scroll container is scrolling
// and when the effect is off-screen / document is hidden.

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { animate } from 'motion/react';

export type GlowingEffectProps = {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  /** "default" = warm accent palette; "white" = monochrome */
  variant?: 'default' | 'white';
  /** Keep glow layer opacity ready (static rim when auto is off) */
  glow?: boolean;
  className?: string;
  /** When true, hide the interactive/orbit layer */
  disabled?: boolean;
  /**
   * Continuous orbit around the perimeter (default for the prompt composer).
   * When true, pointer tracking is off and the highlight loops forever.
   */
  auto?: boolean;
  /** Full loop duration in seconds when `auto` is true; pointer ease duration otherwise */
  movementDuration?: number;
  borderWidth?: number;
};

/* Border arc only — no radial fills (those washed the prompt center, error 9.png) */
const WARM_GRADIENT = `conic-gradient(
  from calc((var(--start, 0) - var(--spread, 20)) * 1deg),
  transparent 0deg,
  transparent calc(var(--spread, 20) * 0.15deg),
  color-mix(in srgb, #f5e6c8 40%, transparent) calc(var(--spread, 20) * 0.45deg),
  color-mix(in srgb, #f0d2a8 80%, var(--accent)) calc(var(--spread, 20) * 0.85deg),
  color-mix(in srgb, var(--accent) 90%, #e8b86d) calc(var(--spread, 20) * 1deg),
  color-mix(in srgb, #f0d2a8 80%, var(--accent)) calc(var(--spread, 20) * 1.15deg),
  color-mix(in srgb, #f5e6c8 40%, transparent) calc(var(--spread, 20) * 1.55deg),
  transparent calc(var(--spread, 20) * 1.85deg),
  transparent 360deg
)`;

const WHITE_GRADIENT = `conic-gradient(
  from calc((var(--start, 0) - var(--spread, 20)) * 1deg),
  transparent 0deg,
  transparent calc(var(--spread, 20) * 0.3deg),
  #f2ede4 calc(var(--spread, 20) * 1deg),
  transparent calc(var(--spread, 20) * 1.7deg),
  transparent 360deg
)`;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = 'default',
  glow = false,
  className,
  movementDuration = 2,
  borderWidth = 1,
  disabled = true,
  auto = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);
  // When false, CSS orbit is paused (off-screen / reduced motion / tab hidden).
  const [orbitLive, setOrbitLive] = useState(true);

  // Auto orbit: CSS-driven (see .glowing-effect.is-auto). Only gate visibility.
  useEffect(() => {
    if (disabled || !auto) return;
    const element = containerRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      setOrbitLive(false);
      element.style.setProperty('--active', '1');
      element.style.setProperty('--start', '40');
      return;
    }

    element.style.setProperty('--active', '1');

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          const visible = Boolean(entry?.isIntersecting);
          setOrbitLive(visible && !document.hidden);
        },
        { root: null, rootMargin: '80px', threshold: 0 },
      );
      io.observe(element);
    }

    const onVisibility = () => {
      setOrbitLive(!document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [auto, disabled]);

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current || auto) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const centerX = left + width * 0.5;
        const centerY = top + height * 0.5;
        const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty('--active', '0');
          return;
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;

        element.style.setProperty('--active', isActive ? '1' : '0');

        if (!isActive) return;

        const currentAngle = parseFloat(element.style.getPropertyValue('--start')) || 0;
        const targetAngle =
          (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty('--start', String(value));
          },
        });
      });
    },
    [auto, inactiveZone, proximity, movementDuration],
  );

  // Pointer tracking only when not in auto mode
  useEffect(() => {
    if (disabled || auto) return;

    const handleScroll = () => handleMove();
    const handlePointerMove = (event: PointerEvent) => handleMove(event);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.body.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handleMove, disabled, auto]);

  const style = {
    '--blur': `${blur}px`,
    '--spread': String(spread),
    '--start': '0',
    '--active': auto ? '1' : '0',
    '--glowingeffect-border-width': `${borderWidth}px`,
    '--glowing-effect-duration': `${movementDuration}s`,
    '--gradient': variant === 'white' ? WHITE_GRADIENT : WARM_GRADIENT,
  } as CSSProperties;

  return (
    <>
      <div
        className={[
          'glowing-effect__static-border',
          glow || auto ? 'is-visible' : '',
          variant === 'white' ? 'is-white' : '',
          disabled ? 'is-shown' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden
      />
      <div
        ref={containerRef}
        style={style}
        className={[
          'glowing-effect',
          glow ? 'is-glow' : '',
          auto ? 'is-auto' : '',
          auto && orbitLive ? 'is-orbit-live' : '',
          blur > 0 ? 'is-blurred' : '',
          disabled ? 'is-disabled' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden
      >
        <div className="glowing-effect__glow" />
      </div>
    </>
  );
});
