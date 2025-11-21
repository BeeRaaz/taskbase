import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

interface TaskCardProps {
  setTasks: Dispatch<SetStateAction<[] | Task[]>>;
  task: Task;
}

export default function TaskCard({ task, setTasks }: TaskCardProps) {
  const { user } = useAuth();
  const supabase = createClient();

  // dialog state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);

  // delete task handler
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error deleting task", error);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // update task handler
  const handleUpdateTask = async (taskId: string) => {
    setSaving(true);

    const { error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", task.id)
      .eq("user_id", user?.id);

    setSaving(false);

    if (error) {
      console.error("Error updating task", error);
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, title } : task))
    );
  };

  return (
    <>
      <Card className="sm:flex-row sm:items-center">
        <CardHeader className="sm:flex-1">
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="sm:w-auto">
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size={"icon"}>
                  <span className="sr-only">Edit</span>
                  <Edit />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div>
                  <form
                    onSubmit={() => handleUpdateTask(task.id)}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <Button disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => handleDeleteTask(task.id)}
            >
              <span className="sr-only">Delete</span>
              <Trash2 />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
