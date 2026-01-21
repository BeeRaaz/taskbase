import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, SupabaseConnectionError } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/types";

function getErrorMessage(err: unknown, fallbackMessage: string): string {
  if (err instanceof SupabaseConnectionError) {
    return "Connection error. Please check your configuration.";
  }

  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    if (message.includes("network") || message.includes("fetch") || message.includes("failed to fetch")) {
      return "Network error. Please check your connection.";
    }
    if (message.includes("jwt") || message.includes("token") || message.includes("unauthorized")) {
      return "Session expired. Please log in again.";
    }
  }

  // Check for Supabase PostgrestError codes
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "PGRST301" || code === "401") {
      return "Session expired. Please log in again.";
    }
    if (code === "PGRST204") {
      return "Item not found.";
    }
  }

  return fallbackMessage;
}

export function useTaskMutations() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("tasks")
        .insert({ title, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newTitle) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", user?.id] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", user?.id]);

      // Optimistic update
      const temporaryTask: Task = {
        id: Math.random().toString(),
        title: newTitle,
        is_completed: false,
        created_at: new Date().toISOString(),
        user_id: user?.id || "",
      };

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks", user?.id], [temporaryTask, ...previousTasks]);
      }

      return { previousTasks };
    },
    onError: (err, newTitle, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      toast.error(getErrorMessage(err, "Failed to add task"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onSuccess: () => {
      toast.success("Task added successfully");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", user?.id] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", user?.id]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks", user?.id],
          previousTasks.filter((t) => t.id !== taskId)
        );
      }

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      toast.error(getErrorMessage(err, "Failed to delete task"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ title })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", user?.id] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", user?.id]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks", user?.id],
          previousTasks.map((t) => (t.id === id ? { ...t, title } : t))
        );
      }
      return { previousTasks };
    },
    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      toast.error(getErrorMessage(err, "Failed to update task"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onSuccess: () => {
      toast.success("Task updated");
    },
  });

  const toggleTaskCompletionMutation = useMutation({
    mutationFn: async ({
      id,
      is_completed,
    }: {
      id: string;
      is_completed: boolean;
    }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ is_completed })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, is_completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", user?.id] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", user?.id]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks", user?.id],
          previousTasks.map((t) => (t.id === id ? { ...t, is_completed } : t))
        );
      }
      return { previousTasks };
    },
    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      toast.error(getErrorMessage(err, "Failed to update status"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
  });

  return {
    addTaskMutation,
    deleteTaskMutation,
    updateTaskMutation,
    toggleTaskCompletionMutation,
  };
}
