"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskMutations } from "@/hooks/useTaskMutations";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskCompletionMutation, deleteTaskMutation, updateTaskMutation } =
    useTaskMutations();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggle = (checked: boolean) => {
    toggleTaskCompletionMutation.mutate({
      id: task.id,
      is_completed: checked,
    });
  };

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskMutation.mutate(
      { id: task.id, title: editTitle },
      {
        onSuccess: () => setIsEditDialogOpen(false),
      }
    );
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center justify-between p-4 mb-3 bg-card border rounded-xl transition-all hover:shadow-md",
          task.is_completed && "opacity-60 bg-muted/50"
        )}
      >
        <div className="flex items-center gap-4 flex-1">
          <Checkbox
            checked={task.is_completed}
            onCheckedChange={handleToggle}
            className="w-5 h-5 rounded-md border-2 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span
            className={cn(
              "font-medium text-base transition-all",
              task.is_completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTaskMutation.isPending}>
                {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
