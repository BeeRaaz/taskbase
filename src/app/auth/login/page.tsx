import Container from "@/components/Container";
import LogInForm from "@/components/LogInForm";

export default function LogInPage() {
  return (
    <>
      <section>
        <Container className="min-h-screen pt-28 pb-10 flex flex-wrap justify-center items-center">
          <LogInForm />
        </Container>
      </section>
    </>
  );
}
