import Link from "next/link";

const ProfileMenuPoint = ({ name, value }: { name: string, value: string | null }) => (
    <div className="flex flex-row my-6 flex-nowrap">
        <div className="pr-8 font-bold dark:text-slate-300 capitalize">{name}</div>
        <div className="dark:text-slate-400">
            {value ? value : <Link href="/dash/profile/edit" className="text-blue-600 hover:underline">{`Add ${name}`}</Link>}
        </div>
    </div>
);

export default ProfileMenuPoint;