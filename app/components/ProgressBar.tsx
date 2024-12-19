import { cn } from "~/lib/utils";
import { Progress } from "./ui/progress";

interface ProgressBarProps {
  onTimePrecent: number;
}
export default function ProgressBar({ onTimePrecent }: ProgressBarProps) {
  const isAbove80 = onTimePrecent > 80;
  const isbelow20 = onTimePrecent < 20;

  return (
    <div className="w-1/2 flex flex-col gap-2">
      <h5
        className={cn("text-center", {
          "text-red-500 font-bold": isbelow20,
          "text-green-500 font-bold": isAbove80,
        })}
      >
        {isNaN(onTimePrecent) ? 0.0 : onTimePrecent.toFixed(2)}%
      </h5>
      <Progress value={onTimePrecent} />
    </div>
  );
}
