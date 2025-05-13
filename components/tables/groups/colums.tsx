"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteGroup, GroupWithCredentials } from "@/lib/data/groups";
import useTeamStore from "@/store/team-store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const groupColumns: ColumnDef<GroupWithCredentials>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "credentials",
    header: "Credentials",
    cell: ({ row }) => {
      const creds = row.original;
      return <span>{creds.credentials?.length}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original;
      const { removeGroup } = useTeamStore();
      const onDelete = async () => {
        const res = await deleteGroup(group.id);
        if (res.status === "success") {
          toast.success(res.message);
          removeGroup(group.id);
        } else {
          toast.error(res.message);
        }
      };

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
                onDelete();
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
