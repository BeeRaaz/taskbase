import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
      toast.error("Failed to add task");
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
      toast.error("Failed to delete task");
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
      toast.error("Failed to update task");
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
      toast.error("Failed to update status");
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
