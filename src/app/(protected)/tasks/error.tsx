"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center pt-28 pb-10 px-6 text-center">
      <h2 className="text-lg font-semibold text-destructive mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message || "An unexpected error occurred"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href={"/"}>
          <Button variant="outline">Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
