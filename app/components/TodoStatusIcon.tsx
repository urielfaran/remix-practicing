import { Status } from "@prisma/client";
import { CheckCircle, Circle, CircleEllipsis, LoaderCircle } from "lucide-react";

interface TodoStatusIconProps {
  status: keyof typeof  Status;
}

function TodoStatusIcon({ status }: TodoStatusIconProps) {
  switch (status) {
    case "COMPLETED": {
      return <CheckCircle size={"20px"} className="text-green-400" />;
    }
    case "IN_PROGGRESS": {
      return <LoaderCircle size={"20px"} className="text-blue-500" />;
    }
    case "NOT_STARTED": {
      return <CircleEllipsis size={"20px"} />;
    }
    default: {
      return <Circle size={"20px"} />;
    }
  }
}

export default TodoStatusIcon;
