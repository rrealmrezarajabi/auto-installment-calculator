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
    <div className="grid items-start gap-5 md:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6">
      <CalculatorNavigation view={view} onSelect={onViewChange} />
      <div className="min-w-0">
        <h2 ref={titleRef} tabIndex={-1} className="sr-only">
          {calculatorViews.find(({ id }) => id === view)?.label}
        </h2>
        {children}
      </div>
    </div>
  );
}
