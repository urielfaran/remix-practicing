import { Board } from "@prisma/client";
import { ChevronDownIcon } from "lucide-react";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface BreadcrumbsProps {
  boards: Board[];
}

function Breadcrumbs({ boards }: BreadcrumbsProps) {
  const location = useLocation();
  const locations = location.pathname.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block">Boards</BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {locations[locations.length - 1]} <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {boards.map((board) => (
                <BreadcrumbLink
                  key={board.id}
                  href={`/board/${board.id}/${board.name}`}
                >
                  <DropdownMenuItem key={board.id}>
                    {board.name}
                  </DropdownMenuItem>
                </BreadcrumbLink>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
