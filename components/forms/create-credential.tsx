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

export const CreateCredentialSchema = z.object({
  name: z.string().min(2).max(50),
  database_credential: z
    .object({
      username: z.string().min(2).max(50),
      password: z.string(),
      connection_string: z.string(),
      description: z.string(),
    })
    .optional(),
  server_credential: z
    .object({
      username: z.string().min(2).max(50),
      password: z.string(),
      server_address: z.string(),
      description: z.string(),
    })
    .optional(),
});

export function CreateCredentialForm() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof CreateCredentialSchema>>({
    resolver: zodResolver(CreateCredentialSchema),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(values: z.infer<typeof CreateCredentialSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential Name</FormLabel>
              <FormControl>
                <Input placeholder="Name..." {...field} />
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
