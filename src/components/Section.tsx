import type { ReactNode } from "react";
import { cn } from "../utils/cn";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  background?: "default" | "muted";
  children: ReactNode;
  className?: string;
};

const Section = ({
  id,
  eyebrow,
  title,
  description,
  background = "default",
  children,
  className
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        background === "muted" ? "bg-white" : "bg-surface",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 md:px-10">
        <header className="max-w-2xl space-y-4">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-lg text-slate-600">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
};

export default Section;
