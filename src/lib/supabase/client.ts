import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export class SupabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConnectionError";
  }
}

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new SupabaseConnectionError(
      "Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};
