import Link from "next/link";

const ProfileMenuPoint = ({ name, value }: { name: string, value: string | null }) => (
    <div className="grid grid-cols-2 flex-nowrap justify-between gap-2">
        <div className="font-bold dark:text-slate-300 capitalize overflow-clip text-clip">{name}</div>
        <div className="dark:text-slate-400 flex flex-wrap text-clip overflow-clip text-sm">
            {value ? value : <Link href="/dash/profile/edit" className="text-blue-600 hover:underline">{`Add ${name}`}</Link>}
        </div>
    </div>
);

export default ProfileMenuPoint;