import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LogOutButton() {
  // router
  const router = useRouter();

  // logout handler
  const handleLogOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      <Button onClick={handleLogOut}>Logout</Button>
    </>
  );
}
