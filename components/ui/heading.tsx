import { ReactNode } from "react";

type AppHeaderProps = {
  children?: ReactNode;
  title: string;
  description: string;
};

export default function Heading({
  title,
  description,
  children,
}: AppHeaderProps) {
  return (
    <div className="flex place-content-between place-items-start space-y-3 py-4 ">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children && children}
    </div>
  );
}
