import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'zoom';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  once?: boolean;
}

const getHiddenTransform = (variant: RevealVariant) => {
  switch (variant) {
    case 'left':
      return 'translate3d(-28px, 0, 0)';
    case 'right':
      return 'translate3d(28px, 0, 0)';
    case 'zoom':
      return 'translate3d(0, 18px, 0) scale(0.98)';
    case 'up':
    default:
      return 'translate3d(0, 28px, 0)';
  }
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  variant,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const revealVariant: RevealVariant = variant ?? 'up';

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getHiddenTransform(revealVariant),
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
