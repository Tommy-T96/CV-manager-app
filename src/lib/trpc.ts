import {createTRPCReact} from '@trpc/react-query';
import {httpLink} from '@trpc/client';
import superjson from 'superjson';

// Define a minimal AppRouter type for the client
// In a real app, you would import this from your backend
export type AppRouter = {
  example: {
    hi: {
      _def: {
        inputs: [{name: string}];
        output: {hello: string; date: Date};
      };
    };
  };
};

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