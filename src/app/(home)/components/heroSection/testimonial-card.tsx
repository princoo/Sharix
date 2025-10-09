import { TestimonialCardProps } from "@/lib/types/home";
// import Image from "next/image"
import { User2 } from "lucide-react";

export function TestimonialCard({
  quote,
  name,
  role,
  title,
}: Readonly<TestimonialCardProps>) {
  return (
    <div className="rounded-lg p-8 shadow-lg">
      {title && (
        <h3 className="text-xl font-bold text-muted-foreground mb-4">
          {title}
        </h3>
      )}

      <blockquote className=" text-muted-foreground mb-6 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3">
        <User2
          className="text-muted-foreground rounded-full bg-muted p-1"
          size={48}
        />
        {/* <Image src={avatarUrl || "/placeholder.svg"} alt={name} width={48} height={48} className="rounded-full" /> */}
        <div>
          <p className=" font-semibold">{name}</p>
          <p className="text-slate-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}
