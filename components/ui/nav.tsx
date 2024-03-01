import Link from "next/link";
import { ThemeToggle } from "@/components/utils/ThemeToggle";

import { Profile } from "../ui/profile";
import { Button } from "../ui/button";
import { getUserAuth } from "@/server/auth";
import NavMenu from "./navMenu";
import { api } from "@/trpc/server";
export default async function Nav() {

  const { session } = await getUserAuth();
  const user = await api.user.getAuthedUserWithInstitution.query();
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
          {/* //TODO: change if admin panel will exist */}
          {user?.role == 'STUDENT' &&

            <div className="z-[20]"><NavMenu />
            </div>}
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
