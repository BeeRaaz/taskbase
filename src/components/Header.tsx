import Link from "next/link";
import Container from "./Container";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <>
      <header className="py-5 fixed top-0 left-0 right-0 z-9999 bg-background border-b border-b-foreground/10">
        <Container className="flex flex-wrap justify-between items-center gap-5">
          <div>
            <Link
              href={"/"}
              className="font-semibold text-2xl tracking-tighter"
            >
              TaskBase
            </Link>
          </div>
          <div>
            <AuthButtons />
          </div>
        </Container>
      </header>
    </>
  );
}
