import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { createTeam } from "@/lib/data/teams";
import useTeamStore from "@/store/team-store";
import { UserTeamWithData } from "@/lib/data/user";

export const CreateTeamSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
});

export function CreateTeamForm({ closeDialog }: { closeDialog: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const { addTeam } = useTeamStore();
  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateTeamSchema>) {
    try {
      const result = await createTeam(values);
      toast.success(`${result.name} Created succesfully`);
      form.reset();
      const newTeam: UserTeamWithData = {
        groups: [],
        credentials: [],
        ...result,
      };
      addTeam(newTeam);
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
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input placeholder="Team" {...field} />
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
              <FormLabel>Team description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
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
