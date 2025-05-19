import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useTeamStore from "@/store/teams";
import { useForm } from "react-hook-form";

export const EditTeamSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export default function EditTeamButton() {
  const { activeTeam } = useTeamStore();
  const form = useForm<z.infer<typeof EditTeamSchema>>({
    defaultValues: {
      name: activeTeam?.name,
      description: activeTeam?.description || "",
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer">Edit Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Team</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
