import { Board } from "@prisma/client";
import { ChevronDownIcon } from "lucide-react";
import { useParams } from "react-router";
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
  const { name } = useParams();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block">Boards</BreadcrumbItem>
        {name && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {name} <ChevronDownIcon />
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
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
