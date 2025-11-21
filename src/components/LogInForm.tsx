"use client";

import { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LogInForm() {
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // router
  const router = useRouter();

  // signup handler
  const handleLogIn = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/tasks");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Don't have an account yet?{" "}
            <Link
              href={"/auth/signup"}
              className="underline hover:no-underline"
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogIn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password:</Label>
                <Link
                  href={"/auth/forgot-password"}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
