"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  TRPCClientError,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import type { AppRouter, TRPCErrorWithData } from "~/server/api/root";

import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers: Headers;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, _mutation) => {
            if (error instanceof TRPCClientError) {
              const {
                code,
                stack,
                zodError: _,
              } = (error as TRPCErrorWithData).data;
              const { message } = error;

              toast({
                title:
                  env.NEXT_PUBLIC_NODE_ENV === "development"
                    ? `${code}: ${message}`
                    : message,
                description:
                  env.NEXT_PUBLIC_NODE_ENV === "development"
                    ? `${stack
                        ?.replace(
                          /^(?:.*?\/){0,3}([^\/\n]+\/[^\/\n]+\/[^\/\n]+)$/gm,
                          "$1",
                        )
                        .replaceAll(")", "")}`
                    : undefined,
                variant: "destructive",
              });
            }

            const { statusText } = error as Response;
            toast({
              title: statusText,
              variant: "destructive",
            });
          },
        }),
        queryCache: new QueryCache({
          onError: (error, _query) => {
            if (error instanceof TRPCClientError) {
              const {
                code,
                stack,
                zodError: _,
              } = (error as TRPCErrorWithData).data;
              const { message } = error;

              toast({
                title:
                  env.NEXT_PUBLIC_NODE_ENV === "development"
                    ? `${code}: ${message}`
                    : message,
                description:
                  env.NEXT_PUBLIC_NODE_ENV === "development"
                    ? `${stack
                        ?.replace(
                          /^(?:.*?\/){0,3}([^\/\n]+\/[^\/\n]+\/[^\/\n]+)$/gm,
                          "$1",
                        )
                        .replaceAll(")", "")}`
                    : undefined,
                variant: "destructive",
              });
            }
          },
        }),
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            const heads = new Map(props.headers);
            heads.set("x-trpc-source", "react");
            return Object.fromEntries(heads);
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
