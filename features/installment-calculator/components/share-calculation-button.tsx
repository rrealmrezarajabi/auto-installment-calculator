"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SharedCalculation } from "../model/shared-calculation-types";
import { createCalculationUrl } from "../lib/share-calculation";

export function ShareCalculationButton({ calculation }: { calculation: SharedCalculation | null }) {
  const [fallbackLink, setFallbackLink] = useState<{ url: string; signature: string } | null>(null);
  const signature = JSON.stringify(calculation);
  const [copying, setCopying] = useState(false);

  async function share() {
    if (!calculation) return;
    const link = createCalculationUrl(window.location.href, calculation);
    setCopying(true);
    try {
      await navigator.clipboard.writeText(link);
      setFallbackLink(null);
      toast.success("لینک محاسبه کپی شد.");
    } catch {
      setFallbackLink({ url: link, signature });
      toast.error("کپی خودکار ممکن نشد؛ لینک را دستی کپی کنید.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="mt-5 space-y-3 border-t pt-5">
      <Button type="button" variant="outline" className="h-11 w-full" disabled={!calculation || copying} onClick={() => { void share(); }}>
        <Share2 size={16} aria-hidden="true" />{copying ? "در حال کپی…" : "کپی لینک محاسبه"}
      </Button>
      {fallbackLink?.signature === signature && <Input aria-label="لینک محاسبه" dir="ltr" readOnly value={fallbackLink.url}
        onFocus={(event) => event.currentTarget.select()} />}
    </div>
  );
}
