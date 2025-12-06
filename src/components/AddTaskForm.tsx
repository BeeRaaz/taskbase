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
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { Loader2 } from "lucide-react";

export default function AddTaskForm() {
  const { user } = useAuth();
  const { addTaskMutation } = useTaskMutations();

  // states
  const [taskTitle, setTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  // router
  const router = useRouter();

  // addtaskform submit handler
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty.");
      return;
    }

    if (!user) {
      setError("You must be logged in to add a task");
      return;
    }

    addTaskMutation.mutate(trimmedTitle, {
      onSuccess: () => {
        router.push("/tasks");
      },
    });
  };

  return (
    <>
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>
            What do you want to get done today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                name="task-title"
                type="text"
                placeholder="e.g., Buy groceries"
                value={taskTitle}
                onChange={(e) => {
                  setTaskTitle(e.target.value);
                  if (error) setError(null);
                }}
                className={error ? "border-destructive" : ""}
                autoFocus
              />
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={addTaskMutation.isPending}
              className="w-full"
            >
              {addTaskMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
