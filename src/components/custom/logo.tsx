import { Shapes } from "lucide-react";
import Link from "next/link";
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
      {" "}
      <Link href="/">
        {" "}
        <Shapes size={size} />{" "}
      </Link>{" "}
    </div>
  );
}
