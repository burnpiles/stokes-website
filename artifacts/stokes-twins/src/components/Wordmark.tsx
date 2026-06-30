import React from "react";

interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
}

export function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const sizeMap = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    hero: "text-[clamp(68px,8vw,180px)]",
  };

  return (
    <div 
      className={`font-display inline-flex items-center text-foreground uppercase tracking-tight ${sizeMap[size]} ${className}`}
      style={{ textShadow: "0.052em 0.052em 0 #E13B2C" }}
    >
      <span>ST</span>
      <span className="inline-flex items-center justify-center relative mx-[0.02em]">
        <svg 
          viewBox="0 0 64 84" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="13" 
          strokeLinejoin="miter"
          className="text-foreground inline-block w-[0.66em] h-[0.84em]"
          style={{ filter: "drop-shadow(0.052em 0.052em 0 #E13B2C)" }}
        >
          <polygon points="13,9 55,42 13,75" />
        </svg>
      </span>
      <span>KES</span>
    </div>
  );
}
