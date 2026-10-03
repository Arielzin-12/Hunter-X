import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/** Number that counts up once it scrolls into view. */
export function Counter({ value, suffix, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString("pt-BR");
        }
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
