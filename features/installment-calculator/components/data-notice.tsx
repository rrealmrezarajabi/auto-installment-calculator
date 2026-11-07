import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataNoticeProps {
  message: string;
  retry: () => void;
  pending: boolean;
}

export function DataNotice({ message, retry, pending }: DataNoticeProps) {
  return (
    <div role="alert" className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
      <AlertCircle size={20} className="shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 basis-48 leading-6">{message}</p>
      <Button variant="outline" className="h-11" onClick={retry} disabled={pending}>
        <RotateCcw size={16} aria-hidden="true" />{pending ? "در حال دریافت…" : "تلاش مجدد"}
      </Button>
    </div>
  );
}
