import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useAuthForConvex() {
  const [state, setState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    fetchToken: () => Promise<string | null>;
  }>({
    isLoading: true,
    isAuthenticated: false,
    fetchToken: async () => null,
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        isLoading: false,
        isAuthenticated: !!user,
        fetchToken: async () => {
          if (!user) return null;
          return user.getIdToken();
        },
      });
    });
    return unsubscribe;
  }, []);

  return state;
}
