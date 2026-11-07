"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { CalculatorView } from "../types/calculator-view-types";
import { calculatorViews, CalculatorNavigation } from "./calculator-navigation";

interface CalculatorWorkspaceProps {
  view: CalculatorView;
  onViewChange: (view: CalculatorView) => void;
  children: ReactNode;
}

export function CalculatorWorkspace({ view, onViewChange, children }: CalculatorWorkspaceProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousView = useRef(view);

  useEffect(() => {
    if (previousView.current !== view) {
      titleRef.current?.focus({ preventScroll: true });
      previousView.current = view;
    }
  }, [view]);

  return (
    <div className="grid items-start gap-5 md:grid-cols-[12rem_minmax(0,1fr)] lg:gap-7">
      <CalculatorNavigation view={view} onSelect={onViewChange} />
      <div className="min-w-0">
        <div className="mb-5 flex min-h-10 items-center justify-between gap-3">
          <h2 ref={titleRef} tabIndex={-1} className="text-lg font-semibold outline-none sm:text-xl">
            {calculatorViews.find(({ id }) => id === view)?.label}
          </h2>
          <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />محاسبه آنی</span>
        </div>
        {children}
      </div>
    </div>
  );
}
