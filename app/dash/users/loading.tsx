import { LoaderIcon } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <LoaderIcon className="m-auto animate-spin" />
        </div>
    );
}
