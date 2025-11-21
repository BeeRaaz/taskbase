import Container from "@/components/Container";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <section>
        <Container className="min-h-screen pt-28 pb-10 flex flex-wrap justify-center items-center">
          <SignUpForm />
        </Container>
      </section>
    </>
  );
}
