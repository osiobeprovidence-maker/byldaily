export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL ?? "",
      applicationID: "convex",
    },
    {
      domain: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
      applicationID: "firebase",
    },
  ],
};
