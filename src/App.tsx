import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc, trpcClient} from './lib/trpc';
import RootNavigator from './navigation/RootNavigator';

// Create a client for React Query
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;