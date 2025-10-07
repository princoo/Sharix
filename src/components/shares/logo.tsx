import { Shapes } from "lucide-react";
import React from "react";

export default function Logo({ className,size=30 }: { className?: string,size?:number }) {
  return (
    <div className={className}>
      <Shapes size={size} />
    </div>
  );
}
