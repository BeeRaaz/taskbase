import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="pt-28 pb-10 min-h-screen flex flex-wrap justify-center items-center text-center">
        <Container>
          <h1>Welcome to TaskBase!</h1>
          <Link href={"/tasks"}>
            <Button>View your tasks</Button>
          </Link>
        </Container>
      </section>
    </>
  );
}
