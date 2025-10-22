'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './client';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分間はキャッシュが新鮮
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        refetchOnWindowFocus: false, // ウィンドウフォーカス時に再取得しない
        refetchOnMount: false, // マウント時に再取得しない
        refetchOnReconnect: false, // 再接続時に再取得しない
        retry: 1, // エラー時は1回だけリトライ
      },
    },
  }));
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
} 