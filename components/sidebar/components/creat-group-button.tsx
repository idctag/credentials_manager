import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { createGroup } from "@/lib/data/groups";
import useTeamStore from "@/store/team-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
});
export default function CreateGroupButton() {
  const { activeTeam } = useTeamStore();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { addGroup } = useTeamStore();
  const form = useForm<z.infer<typeof CreateGroupSchema>>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  async function onSubmit(values: z.infer<typeof CreateGroupSchema>) {
    if (!activeTeam?.id) {
      toast.error("Create or select Team first");
      return;
    }
    setIsPending(true);
    try {
      const result = await createGroup(values, activeTeam.id);
      toast.success(`${result.name} Created succesfully`);
      form.reset();
      const newGroup = {
        ...result,
        credentials: null,
      };
      addGroup(newGroup);
    } catch (err) {
      toast.error("Failed to create group");
    } finally {
      setOpen(false);
      setIsPending(false);
    }
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Server..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group description</FormLabel>
                  <FormControl>
                    <Input placeholder="Server..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              {isPending ? <Loader /> : <>Submit</>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
