import React from 'react';
import ReactDOM from 'react-dom/client';
import BaseRoutes from '@/routes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './index.css'
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  const queryClient = new QueryClient();
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BaseRoutes />
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
