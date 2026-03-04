import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={defaultQueryClient}>{children}</QueryClientProvider>;
};

export const getQueryClient = () => defaultQueryClient;
