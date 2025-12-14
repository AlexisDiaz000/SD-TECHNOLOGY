import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, onAuthChange } from '@/services/auth';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      const current = await getUser();
      setUser(current);
      setLoading(false);
      unsubscribe = onAuthChange((u) => setUser(u));
    })();
    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

