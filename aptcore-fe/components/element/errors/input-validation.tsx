import { TriangleAlert } from "lucide-react";

type Props = {
  error: string | null | undefined;
};

export default function InputValidation({ error }: Props) {
  if (!error) return null;

  return (
    <span className="text-destructive text-xs flex gap-1 items-center">
      <TriangleAlert className="size-4 text-yellow-500 animate-bounce" />
      {error}
    </span>
  );
}
