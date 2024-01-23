import { ReactNode } from "react";

const Container = ({ className: classes, children }: { className?: string, children?: ReactNode }) => {
    return (
        <div className={`container${classes ? (" " + classes) : ""}`}>
            {children}
        </div>
    );
}

export default Container;