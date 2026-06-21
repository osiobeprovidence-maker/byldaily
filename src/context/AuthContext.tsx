import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { auth, googleProvider } from "../lib/firebase";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  convexUserId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? "",
    username: fbUser.email?.split("@")[0] ?? "",
    avatarUrl: fbUser.photoURL ?? "",
    bio: "",
    interests: [],
    followers: 0,
    following: 0,
    isAdmin: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const syncUser = useMutation(api.users.upsertUser);

  const firebaseUid = firebaseUser?.uid ?? "";
  const convexUserDoc = useQuery(api.users.getByFirebaseUid, firebaseUid ? { firebaseUid } : "skip");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
        syncUser({
          firebaseUid: user.uid,
          email: user.email ?? "",
          name: user.displayName ?? "",
          avatarUrl: user.photoURL ?? "",
        });
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [syncUser]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  if (user && convexUserDoc) {
    user.name = convexUserDoc.name || user.name;
    user.username = convexUserDoc.username || user.username;
    user.avatarUrl = convexUserDoc.avatarUrl || user.avatarUrl;
    user.bio = convexUserDoc.bio || "";
    user.interests = convexUserDoc.interests || [];
    user.followers = convexUserDoc.followers || 0;
    user.following = convexUserDoc.following || 0;
    user.isAdmin = convexUserDoc.isAdmin || isAdmin;
  }

  const isAuthenticated = !!firebaseUser;
  const convexUserId = convexUserDoc?._id ?? null;

  return (
    <AuthContext.Provider
      value={{ user, convexUserId, isAuthenticated, isAdmin: user?.isAdmin ?? false, isLoading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}