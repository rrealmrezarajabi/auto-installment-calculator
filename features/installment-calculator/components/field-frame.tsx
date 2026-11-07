import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FieldFrameProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldFrame({ id, label, error, hint, children }: FieldFrameProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {children}
      <p id={`${id}-message`} className={error || hint ? `text-xs leading-5 ${error ? "text-destructive" : "text-muted-foreground"}` : "hidden"}>
        {error ?? hint}
      </p>
    </div>
  );
}
