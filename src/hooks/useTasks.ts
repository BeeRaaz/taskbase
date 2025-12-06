import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTasks() {
  const supabase = createClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });
}
