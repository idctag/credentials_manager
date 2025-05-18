"use client";
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
import { Button } from "../ui/button";

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

export default function CreateCredentialButton({
  groupId,
}: {
  groupId?: string;
}) {
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
            <div className="space-y-4">
              <div className=" flex items-center justify-between">
                <h3 className="text-lg font-medium">Servers</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendServer({
                      name: "",
                      description: "",
                      password: "",
                      server_address: "",
                      username: "",
                      type: credentialTypeEnum.enumValues[0],
                    })
                  }
                >
                  Add Server
                </Button>
              </div>
              {serverFields.map((field, index) => (
                <div key={field.id} className="space-y-4 border p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name={`servers.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Server name..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`servers.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Server description..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`servers.${index}.username`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Server username..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`servers.${index}.password`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server password</FormLabel>
                        <FormControl>
                          <Input placeholder="Server password..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`servers.${index}.server_address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server address</FormLabel>
                        <FormControl>
                          <Input placeholder="Server address..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeServer()}
                  >
                    Remove Server
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Databases</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendDatabase({
                      name: "",
                      username: "",
                      password: "",
                      connection_string: "",
                      description: "",
                      type: credentialTypeEnum.enumValues[0],
                    })
                  }
                >
                  Add Database
                </Button>
              </div>
              {databaseFields.map((field, index) => (
                <div key={field.id} className="space-y-4 border p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name={`databases.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Database name..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`databases.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Database description..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`databases.${index}.username`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Database username..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`databases.${index}.password`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Database password..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`databases.${index}.connection_string`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database connection_string</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Database connection_string..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeDatabase()}
                  >
                    Remove Database
                  </Button>
                </div>
              ))}
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Credential"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
