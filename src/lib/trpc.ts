import {createTRPCReact} from '@trpc/react-query';
import {httpLink} from '@trpc/client';
import superjson from 'superjson';
import { inferRouterInputs, inferRouterOutputs, AnyRouter } from '@trpc/server';

// Define a minimal AppRouter type for the client
// In a real app, you would import this from your backend
interface AppRouter {
  _def: {
    queries: {
      example: {
        hi: {
          _def: {
            inputs: [{name: string}];
            output: {hello: string; date: Date};
          };
        };
      };
    };
    mutations: {};
    subscriptions: {};
  };
  // Add required properties to satisfy Router constraint
  createCaller: () => any;
}

export type { AppRouter };

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

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;