import AddTaskForm from "@/components/AddTaskForm";
import Container from "@/components/Container";

export default function AddTaskPage() {

  return (
      <section>
        <Container className="min-h-screen pt-28 pb-10 flex flex-wrap justify-center items-center">
          <AddTaskForm />
        </Container>
      </section>
  );
}