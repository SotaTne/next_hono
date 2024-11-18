import { GitHub } from "arctic";

export const githubAuth = () => {
  if (!process.env.GITHUB_CLIENT_ID) {
    throw new Error("GITHUB_CLIENT_ID is not defined");
  }
  if (!process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_SECRET is not defined");
  }
  if (!process.env.GITHUB_REDIRECT_URI) {
    throw new Error("GITHUB_REDIRECT_URI is not defined");
  }
  return new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    process.env.GITHUB_REDIRECT_URI,
  );
};
