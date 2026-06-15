'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from '@/store';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(var(--color-surface))',
                color: 'rgb(var(--color-text))',
                border: '1px solid rgb(var(--color-border))',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                duration: 3000,
                style: {
                  background: 'rgba(var(--color-success), 0.1)',
                  color: 'rgb(var(--color-text))',
                  border: '1px solid rgb(var(--color-success))',
                },
                iconTheme: {
                  primary: 'rgb(var(--color-success))',
                  secondary: 'rgb(var(--color-surface))',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: 'rgba(var(--color-danger), 0.1)',
                  color: 'rgb(var(--color-text))',
                  border: '1px solid rgb(var(--color-danger))',
                },
                iconTheme: {
                  primary: 'rgb(var(--color-danger))',
                  secondary: 'rgb(var(--color-surface))',
                },
              },
            }}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
