"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import LogOutButton from "./LogOutButton";
import Link from "next/link";

export default function AuthButtons() {
  const { user } = useAuth();

  return user ? (
    <div className="flex items-center gap-3">
      <span>Hey, {user.email}!</span>
      <LogOutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href={"/auth/login"}>
        <Button variant={"outline"}>Sign in</Button>
      </Link>
      <Link href={"/auth/signup"}>
        <Button variant={"default"}>Sign up</Button>
      </Link>
    </div>
  );
}
