import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteGroup, FetchGroup } from "@/lib/data/groups";
import useTeamStore from "@/store/team-store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function handleDelete(groupId: string) {
  try {
    deleteGroup(groupId);
    toast.success(`Group ${groupId} deleted successfully`);
  } catch (err) {
    toast.error(`Failed to delete group`);
  }
}

export const groupColumns: ColumnDef<FetchGroup>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "owner_id",
    header: "owner",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original;
      const { deleteGroup } = useTeamStore();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className=" size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                handleDelete(group.id);
                deleteGroup(group.id);
              }}
              className="hover:cursor-pointer text-red-500"
            >
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
