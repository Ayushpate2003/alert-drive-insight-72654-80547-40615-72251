import { useEffect, useState } from 'react';

export const WireframeCar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Car wireframe */}
      <div className="relative" style={{ transform: `translateX(${progress - 50}%)` }}>
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          className="drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]"
        >
          {/* Car body */}
          <path
            d="M 20 40 L 20 30 L 35 20 L 55 20 L 70 30 L 100 30 L 100 40 Z"
            fill="none"
            stroke="rgb(0, 191, 255)"
            strokeWidth="1.5"
            className="animate-pulse-glow"
          />
          {/* Windows */}
          <path
            d="M 38 28 L 38 22 L 52 22 L 52 28 Z"
            fill="none"
            stroke="rgb(0, 191, 255)"
            strokeWidth="1"
            className="animate-pulse-glow"
          />
          {/* Wheels */}
          <circle
            cx="30"
            cy="42"
            r="5"
            fill="none"
            stroke="rgb(0, 191, 255)"
            strokeWidth="1.5"
          />
          <circle
            cx="85"
            cy="42"
            r="5"
            fill="none"
            stroke="rgb(0, 191, 255)"
            strokeWidth="1.5"
          />
        </svg>

        {/* AI sensor nodes around driver */}
        <div className="absolute top-4 left-12">
          <div className="relative">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary animate-ping-slow"
                style={{
                  top: `${Math.sin(i * Math.PI * 0.5) * 15}px`,
                  left: `${Math.cos(i * Math.PI * 0.5) * 15}px`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Data streams */}
        <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative w-20 h-0.5 bg-primary/20 overflow-hidden">
              <div
                className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
