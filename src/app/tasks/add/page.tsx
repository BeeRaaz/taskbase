"use client";

import AddTaskForm from "@/components/AddTaskForm";
import Container from "@/components/Container";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const {session} = useAuth();
  const router = useRouter();

  if (!session) {
    router.push("/auth/login");
  }

  return (
      <section>
        <Container className="min-h-screen pt-28 pb-10 flex flex-wrap justify-center items-center">
          <AddTaskForm />
        </Container>
      </section>
  );
}
