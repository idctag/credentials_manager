import { credentialTypeEnum } from "@/db/schema";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useTeamStore from "@/store/team-store";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { PlusCircleIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export const CreateCredentialSchema = z.object({
  name: z.string().min(2),
  servers: z.array(
    z
      .object({
        name: z.string().min(2),
        username: z.string(),
        password: z.string(),
        server_address: z.string(),
        description: z.string(),
        type: z.enum(credentialTypeEnum.enumValues),
      })
      .optional(),
  ),
  databases: z.array(
    z
      .object({
        name: z.string().min(2),
        username: z.string(),
        password: z.string(),
        connection_string: z.string(),
        description: z.string(),
        type: z.enum(credentialTypeEnum.enumValues),
      })
      .optional(),
  ),
});

export default function CreateCredentialButton(groupId: string | null) {
  const { activeTeam } = useTeamStore();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof CreateCredentialSchema>>({
    resolver: zodResolver(CreateCredentialSchema),
    defaultValues: {
      name: "",
      databases: [],
      servers: [],
    },
  });
  const {
    fields: serverFields,
    append: appendServer,
    remove: removeServer,
  } = useFieldArray({
    control: form.control,
    name: "servers",
  });
  const {
    fields: databaseFields,
    append: appendDatabase,
    remove: removeDatabase,
  } = useFieldArray({
    control: form.control,
    name: "databases",
  });
  async function onSubmit(values: z.infer<typeof CreateCredentialSchema>) {
    console.log(values);
    if (!activeTeam?.id) {
      toast.error("Create or select Team first");
      return;
    }
  }
  const defaultServer = {
    name: "",
    username: "",
    password: "",
    server_address: "",
    description: "",
    type: credentialTypeEnum.enumValues[1],
  };
  const defaultDatabase = {
    name: "",
    username: "",
    password: "",
    connection_string: "",
    description: "",
    type: credentialTypeEnum.enumValues[0],
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <PlusCircleIcon />
          <span>Add Creadential</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
