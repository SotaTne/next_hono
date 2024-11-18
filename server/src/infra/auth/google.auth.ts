import { Google } from "arctic";

export const googleAuth = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
  }
  if (!process.env.GOOGLE_REDIRECT_URI) {
    throw new Error("GOOGLE_REDIRECT_URI is not defined");
  }
  return new Google(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
};
