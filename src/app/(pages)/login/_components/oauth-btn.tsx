"use client";

import { Button } from "~/components/ui/button";

import { setGoogleCookie } from "../actions/oauth";

export const GoogleButton = () => {
  return <Button onClick={() => setGoogleCookie()}>Login via Google</Button>;
};
