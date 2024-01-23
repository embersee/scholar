import { GetApprenticeship } from "@/server/schema/apprenticeship";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  apprts: GetApprenticeship;
};
export default function ApprtsList(props: Props) {
  if (!props.apprts.length) {
    return (
      <div className="text-center">
        <h2 className="mt-2 text-sm font-semibold">No apprenticeships.</h2>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new apprenticeship!
        </p>

        <Button asChild>
          <Link href="/dash/apprts/new" className="mt-2">
            Create
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <ul>
      {props.apprts.map((v, i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}
