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
import { createTeam, UserTeams } from "@/lib/data/teams";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type CreateTeamFormProps = {
  onSuccess?: (newTeam: UserTeams) => void;
};
export const createTeamSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
});

export function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  async function onSubmit(values: z.infer<typeof createTeamSchema>) {
    try {
      setIsLoading(true);
      // Call the server action
      const result = await createTeam(values);

      if (result.success) {
        // Create a team object from the result
        const newTeam: UserTeams = {
          teamId: result.teamId!,
          teamName: values.name,
          teamDescription: values.description,
          role: "admin",
          // Add any other properties your UserTeams type requires
        };

        // Reset form
        form.reset();

        // Call onSuccess with the new team if provided
        if (onSuccess) {
          onSuccess(newTeam);
        }
      } else {
        console.error("Error creating team:", result.error);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="team one" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Team"
          )}
        </Button>{" "}
      </form>
    </Form>
  );
}
