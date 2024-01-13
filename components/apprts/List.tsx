import { GetApprenticeships } from "@/server/schema/apprenticeship";
import { Button } from "@/components/ui/button";

type Props = {
  apprts: GetApprenticeships;
};
export default function ApprtsList(props: Props) {
  if (!props.apprts.length) {
    return (
      <div className="text-center">
        <h2 className="mt-2 text-sm font-semibold">No apprenticeships.</h2>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new apprenticeship!
        </p>
        <div className="mt-2">
          <Button>Create</Button>
        </div>
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
