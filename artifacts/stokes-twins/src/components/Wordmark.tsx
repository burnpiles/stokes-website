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
      className={`font-display inline-flex items-baseline leading-none text-foreground uppercase tracking-tight ${sizeMap[size]} ${className}`}
      style={{ textShadow: "0.052em 0.052em 0 #E13B2C" }}
    >
      <span>ST</span>
      <svg 
        viewBox="0 0 72 84"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="13" 
        strokeLinejoin="miter"
        className="text-foreground inline-block w-[0.62em] h-[0.72em] mx-[0.03em] self-baseline"
        style={{ filter: "drop-shadow(0.052em 0.052em 0 #E13B2C)" }}
      >
        <polygon points="8,12 62,42 8,72" />
      </svg>
      <span>KES</span>
    </div>
  );
}
