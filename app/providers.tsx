"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  // Server renders must never share a cache between requests.
  if (isServer) {
    return new QueryClient();
  }

  // Keep the browser cache even if React retries an initial suspended render.
  return browserQueryClient ??= new QueryClient();
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
