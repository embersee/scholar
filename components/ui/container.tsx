import { ReactNode } from "react";

const Container = ({ className: classes, children }: { className?: string, children?: ReactNode }) => {
    return (
        <div
            className={`flex bg-white rounded-sm p-10 border-solid border-2 border-gray-100 dark:bg-slate-800 dark:border-none overflow-hidden h-max${classes ? (" " + classes) : ""}`}
        >
            {children}
        </div>
    );
}

export default Container;