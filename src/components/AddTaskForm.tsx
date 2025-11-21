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
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AddTaskForm() {
  const { user } = useAuth();

  // states
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // router
  const router = useRouter();

  // addtaskform submit handler
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!taskTitle.trim()) {
      setError("Task title cannot be empty.")
      return;
    }

    if (!user) {
      setError("You must be logged in to add a task")
      return;
    }
    
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("tasks").insert({
      title: taskTitle,
      user_id: user?.id,
    });

    setLoading(false);

    if (error) {
      console.error("Error while adding task to database", error);
      setError(error.message);
    } else {
      router.push("/tasks");
    }
  };

  return (
    <>
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
          <CardDescription>Add a new task</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="task-title">Title:</Label>
              <Input
                id="task-title"
                name="task-title"
                type="text"
                placeholder="Add task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              {error && <p className="text-red-600">{error}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding task..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
