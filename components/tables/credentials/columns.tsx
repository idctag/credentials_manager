import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCredential, FetchCredentialType } from "@/lib/data/credentials";
import { useCredentialStore } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const credentialColumns: ColumnDef<FetchCredentialType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "servers",
    header: "Servers",
    cell: ({ row }) => {
      const cred = row.original;
      return <span>{cred.servers?.length}</span>;
    },
  },
  {
    accessorKey: "databases",
    header: "Databases",
    cell: ({ row }) => {
      const cred = row.original;
      return <span>{cred.databases?.length}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const credential = row.original;
      const { removeCredential } = useCredentialStore();
      const onDelete = async () => {
        const res = await deleteCredential(credential.id);
        if (res.status === "success") {
          toast.success(res.message);
          removeCredential(credential.id);
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
