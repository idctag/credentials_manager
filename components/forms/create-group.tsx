"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useTeamStore from "@/store/team-store";
import { toast } from "sonner";
import { createGroup } from "@/lib/data/groups";
import { useState } from "react";
import { Loader } from "lucide-react";
import useGroupStore from "@/store/group-store";

export const CreateGroupSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
});

export function CreateGroupForm({ closeDialog }: { closeDialog: () => void }) {
  const { activeTeam } = useTeamStore();
  const [isPending, setIsPending] = useState(false);
  const { groups, setGroups } = useGroupStore();

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
      setGroups([...groups, newGroup]);
      closeDialog();
    } catch (err) {
      toast.error("Failed to create group");
    } finally {
      setIsPending(false);
    }
  }

  return (
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
  );
}
