"use client";

import { type Session } from "lucia";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext } from "react";

export const AuthContext = createContext<Session | null>(null);

export const AuthContextProvider = ({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) => {
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  if (context === null) {
    // throw new Error("User is not logged in");
    router.push("/login");
    return {} as unknown as Session;
  }
  return context;
};
