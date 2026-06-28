/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // Scroll to top and clear hash on page reload / initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      navigate(window.location.pathname, { replace: true });
    }
  }, []);

  // Scroll to top for subsequent path changes
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
            },
          }}
        />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  );
}

