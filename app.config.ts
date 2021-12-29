// @ts-nocheck
import "dotenv/config";

export default ({ config }: ConfigConte) => {
  const apiKey = process.env.API_KEY!;
  const authDomain = process.env.AUTH_DOMAIN!;
  const projectId = process.env.PROJECT_ID!;
  const storageBucket = process.env.STORAGE_BUCKET!;
  const messagingSenderId = process.env.MESSAGING_SENDER_ID!;
  const appId = process.env.APP_ID!;
  const measurementId = process.env.MEASURING_ID!;
  const databaseUrl = process.env.DATABASE_URL!;

  return {
    ...config,
    extra: {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
      databaseUrl,
    },
    facebookScheme: "abc12345",
    slug: "GroupStatus",
  };
};
