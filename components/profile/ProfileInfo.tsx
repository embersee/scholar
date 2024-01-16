import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import ProfileMenuPoint from "@/components/profile/ProfileMenuPoint";

const profileInfo = ({ user }: { user: User }) => {
    return <div className="flex bg-white rounded-sm p-10 border-solid border-2 border-gray-100 dark:bg-slate-950 dark:border-none">
        <div className="flex flex-col w-max">
            <Avatar className="w-28 h-28 my-6">
                <AvatarImage src={user.image as string}></AvatarImage>
                <AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-row my-6 flex-nowrap">
                <div className="pr-8 font-bold dark:text-slate-300 capitalize text-2xl">{user.display_name}</div>
            </div>

            <ProfileMenuPoint name="Telegram id" value={user.telegram_id} />
            <ProfileMenuPoint name="Username" value={user.username} />
            <ProfileMenuPoint name="FIO" value={user.FIO} />
            <ProfileMenuPoint name="Email" value={user.email} />
            <ProfileMenuPoint name="Phone" value={user.phone_number} />

            {/*Object.keys(user).map((key: string) =>
                <ProfileMenuPoint name={key} value={user[key as keyof User]?.toString() as string} />
            )*/}
            <Link href="/dash/profile/edit" className="my-6 w-max">
                <Button variant="default" size="lg">Edit</Button>
            </Link>
        </div>
    </div>
}

export default profileInfo;