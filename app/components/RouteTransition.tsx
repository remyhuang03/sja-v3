"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RouteTransitionProps {
  children: React.ReactNode;
}

// Simple progress bar at top during route change (client side nav only)
function TopProgress({ state }: { state: 'idle' | 'animating' | 'done' }) {
  // idle: hidden; animating: grow; done: full width then fade out
  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[200] h-0.5 w-full" aria-hidden="true">
      <div
        className={
          `h-full bg-primary will-change-transform ${
            state === 'idle' ? 'opacity-0 scale-x-0' : ''
          } ${
            state === 'animating' ? 'animate-[progressGrow_0.65s_ease-out_forwards]' : ''
          } ${
            state === 'done' ? 'opacity-0 transition-opacity duration-400 delay-75 scale-x-100' : ''
          }`
        }
        style={{ transformOrigin: 'left' }}
      />
      <style jsx>{`
        @keyframes progressGrow {
          0% {transform: scaleX(0); opacity:1}
          85% {transform: scaleX(0.92); opacity:1}
          100% {transform: scaleX(1); opacity:1}
        }
      `}</style>
    </div>
  );
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const [barState, setBarState] = useState<'idle' | 'animating' | 'done'>('idle');

  // Simulate progress bar pulse on route change (layout re-renders on pathname change)
  useEffect(() => {
    // trigger animation on route change
    setBarState('animating');
    // after grow finished, mark done so it fades (keeping full width)
    const t1 = setTimeout(() => setBarState('done'), 650);
    // then hide it
    const t2 = setTimeout(() => setBarState('idle'), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]);

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
  <TopProgress state={barState} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="min-h-full"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.4, 0.2, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
