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

export default function SignUpForm() {
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // router
  const router = useRouter();

  // signup handler
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
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
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link
              href={"/auth/login"}
              className="underline hover:no-underline"
            >
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
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
              <Label htmlFor="password">Password:</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeat-password">Repeat Password:</Label>
              <Input
                id="repeat-password"
                name="repeat-password"
                type="password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
