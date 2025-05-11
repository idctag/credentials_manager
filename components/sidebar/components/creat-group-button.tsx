import { CreateGroupForm } from "@/components/forms/create-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import useTeamStore from "@/store/team-store";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export default function CreateGroupButton() {
  const { activeTeam } = useTeamStore();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          disabled={activeTeam === null}
          className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground hover:cursor-pointer"
        >
          <PlusCircleIcon />
          <span> Add group</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CreateGroupForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
