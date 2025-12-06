"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus, ListFilter } from "lucide-react";
import TaskItem from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterType = "all" | "active" | "completed";

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks = tasks?.filter((task) => {
    if (filter === "active") return !task.is_completed;
    if (filter === "completed") return task.is_completed;
    return true;
  });

  if (error) {
    return (
      <Container className="pt-28">
        <div className="text-red-500">Error loading tasks.</div>
      </Container>
    );
  }

  return (
    <section className="pt-28 pb-10 min-h-screen">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage your daily goals efficiently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ListFilter className="w-4 h-4" />
                  <span className="capitalize">{filter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={"/tasks/add"}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center p-4 border rounded-xl gap-4"
              >
                <Skeleton className="h-5 w-5 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))
          ) : filteredTasks?.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl opacity-70">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "Get started by adding a new task!"
                  : `No ${filter} tasks to display.`}
              </p>
            </div>
          ) : (
            filteredTasks?.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </Container>
    </section>
  );
}