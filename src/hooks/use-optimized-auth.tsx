"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";

export const useOptimizedAuth = () => {
  const { user, userRole, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  return {
    user,
    userRole,
    loading,
    isInitialized,
    isAuthenticated: !!user,
    hasRole: (roles: string[]) => (userRole ? roles.includes(userRole) : false),
  };
};
