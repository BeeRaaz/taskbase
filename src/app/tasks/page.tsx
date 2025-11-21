"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TaskCard from "@/components/TaskCard";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const { user, session } = useAuth();
  const [tasks, setTasks] = useState<Task[] | []>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // wait until user is loaded
    if (!user) return;

    const fetchUsersTasks = async () => {
      setLoadingTasks(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("tasks")
        .select()
        .eq("user_id", user?.id);

      if (error) {
        console.log("error fetching the tasks", error);
      } else {
        setTasks(data);
      }

      setLoadingTasks(false);
    };

    fetchUsersTasks();
  }, [user]);

  if (!session) {
    router.push("/auth/login");
  }

  return (
    <>
      <section className="pt-28 pb-10">
        <Container>
          <div className="flex flex-wrap justify-between items-center gap-5 mb-5">
            <h1>Your Tasks</h1>
            <Link href={"/tasks/add"}>
              <Button>
                <Plus />
                Add Task
              </Button>
            </Link>
          </div>
          <div>
            {loadingTasks ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p>No tasks yet. Add one!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task: Task) => (
                  <li key={task.id}>
                    <TaskCard task={task} setTasks={setTasks} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
