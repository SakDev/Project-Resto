import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantStyles: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:opacity-95",
  secondary:
    "border border-border bg-card text-foreground hover:border-foreground/15 hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href as Route}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-[1.15rem] px-5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
