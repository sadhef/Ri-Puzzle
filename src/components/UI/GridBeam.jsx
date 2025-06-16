// src/components/UI/GridBeam.jsx
import React from "react";
import { cn } from "@/lib/utils";

export const GridBeam = ({ children, className }) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Main Grid Background - More Visible */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(#d1d5db 1px, transparent 1px),
            linear-gradient(90deg, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Secondary Grid for Depth */}
      <div 
        className="absolute inset-0 opacity-15 dark:opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(#9ca3af 1px, transparent 1px),
            linear-gradient(90deg, #9ca3af 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Dark Mode Grid */}
      <div 
        className="absolute inset-0 opacity-0 dark:opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(#374151 1px, transparent 1px),
            linear-gradient(90deg, #374151 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div 
        className="absolute inset-0 opacity-0 dark:opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(#4b5563 1px, transparent 1px),
            linear-gradient(90deg, #4b5563 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};