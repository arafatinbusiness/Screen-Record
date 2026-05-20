import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if API key exists in environment
    const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    setIsAuthenticated(!!apiKey);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
}
