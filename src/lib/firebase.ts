import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

type FirebaseEnv = {
  API_KEY?: string;
  AUTH_DOMAIN?: string;
  PROJECT_ID?: string;
  STORAGE_BUCKET?: string;
  MESSAGING_SENDER_ID?: string;
  APP_ID?: string;
};

declare const __FIREBASE_ENV__: FirebaseEnv;

const buildEnv = typeof __FIREBASE_ENV__ === "undefined" ? {} : __FIREBASE_ENV__;

const firebaseEnvAliases: Partial<Record<keyof FirebaseEnv, string[]>> = {
  AUTH_DOMAIN: ["AUTHDOMAIN"],
  STORAGE_BUCKET: ["STORAGEBUCKET"],
  MESSAGING_SENDER_ID: ["MESSAGINGSENDER_ID"],
};

function readFirebaseEnv(key: keyof FirebaseEnv) {
  const names = [key, ...(firebaseEnvAliases[key] ?? [])];
  const value = names
    .flatMap((name) => [
      buildEnv[name as keyof FirebaseEnv],
      import.meta.env[`VITE_FIREBASE_${name}`],
      import.meta.env[`FIREBASE_${name}`],
    ])
    .find(Boolean);

  return (value ?? "").trim();
}

const projectId = readFirebaseEnv("PROJECT_ID");
const authDomain = readFirebaseEnv("AUTH_DOMAIN") || (projectId ? `${projectId}.firebaseapp.com` : "");

const firebaseConfig = {
  apiKey: readFirebaseEnv("API_KEY"),
  authDomain,
  projectId,
  storageBucket: readFirebaseEnv("STORAGE_BUCKET"),
  messagingSenderId: readFirebaseEnv("MESSAGING_SENDER_ID"),
  appId: readFirebaseEnv("APP_ID"),
};

const missingFirebaseConfig = Object.entries({
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
})
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseConfig.length > 0) {
  throw new Error(
    `Missing Firebase client configuration: ${missingFirebaseConfig.join(", ")}. ` +
      "Set these variables in Vercel for the Production, Preview, and Development environments, then redeploy.",
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
