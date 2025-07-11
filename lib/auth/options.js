import jwt from "./callbacks/jwt";
import session from "./callbacks/session";
import signIn from "./callbacks/signin";
import { providers } from "./providers";

export const authOptions = {
  providers,
  callbacks: {
    jwt,
    session,
    signIn,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
