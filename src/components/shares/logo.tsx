import { Shapes } from "lucide-react";
import React from "react";

export default function Logo({
  className,
  size = 30,
}: {
  readonly className?: string;
  readonly size?: number;
}) {
  return (
    <div className={className}>
      <Shapes size={size} />
    </div>
  );
}
