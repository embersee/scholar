import Link from "next/link";
import { ThemeToggle } from "@/components/utils/ThemeToggle";

import { Profile } from "../ui/profile";
import { Button } from "../ui/button";
import { getUserAuth } from "@/server/auth";

export default async function Nav() {
  const { session } = await getUserAuth();
  if (!session) return null;
  return (
    <nav className="nav flex max-w-full justify-between p-2 ">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Button variant="link" className="text-xl decoration-from-font">
            Scholar
          </Button>
        </Link>
      </div>
      {session?.user && (
        <div className="flex items-center space-x-2">
          <Profile
            name={session.user.name as string}
            image={session.user.image as string}
          />

          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}
