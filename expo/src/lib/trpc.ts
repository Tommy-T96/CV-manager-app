import {createTRPCReact} from '@trpc/react-query';
import {httpLink} from '@trpc/client';
import superjson from 'superjson';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/backend/trpc/app-router';

// Create a React Query client for tRPC
export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // In a real app, you would use environment variables
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

// Type helpers for inferring types from the router
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;