"use client";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useTeamStore from "@/store/teams";
import { useForm } from "react-hook-form";
import { teamRoleEnum } from "@/db/schema";
import { useEffect, useState } from "react";
import { FetchTeamMember, getTeamMembers } from "@/lib/data/user";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { deleteTeam, removeMember, updateTeam } from "@/lib/data/teams";

export const EditTeamSchema = z.object({
  name: z.string(),
  description: z.string(),
  members: z.array(
    z.object({
      user_id: z.string(),
      email: z.string(),
      role: z.enum(teamRoleEnum.enumValues),
    }),
  ),
});

export default function EditTeamButton() {
  const { activeTeam, setActiveTeam, updateTeamStore, removeTeam } =
    useTeamStore();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [members, setMembers] = useState<FetchTeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log();
  const form = useForm<z.infer<typeof EditTeamSchema>>({
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });
  useEffect(() => {
    if (activeTeam) {
      form.reset({
        name: activeTeam.name || "",
        description: activeTeam.description || "",
        members: [],
      });
    }
  }, [activeTeam, form]);

  useEffect(() => {
    async function fetchMembers() {
      if (isOpen && activeTeam?.id) {
        try {
          setIsLoading(true);
          const fetchedMembers = await getTeamMembers(activeTeam.id);

          setMembers(fetchedMembers);
          form.setValue("members", fetchedMembers);
        } catch (err) {
          console.error("Failed to fetch team members: ", err);
          toast.error("Failed to load team members");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchMembers();
  }, [isOpen, activeTeam?.id, form]);

  async function onSubmit(values: z.infer<typeof EditTeamSchema>) {
    if (!activeTeam?.id) {
      toast.error("No active team selected");
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateTeam(activeTeam.id, values);
      if (result.status === "success") {
        updateTeamStore({
          ...activeTeam,
          name: values.name,
          description: values.description,
        });
        setActiveTeam({
          ...activeTeam,
          name: values.name,
          description: values.description,
        });
        toast.success("Team updated successfully");
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed to update team:", err);
      toast.error("Failed to update team");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRoleChange(index: number, newRole: "admin" | "member") {
    const updatedMembers = [...members];
    updatedMembers[index].role = newRole;
    setMembers(updatedMembers);
    form.setValue("members", updatedMembers);
  }

  async function handleRemoveMember(index: number, id: string) {
    const res = await removeMember(id);
    if (res.status === "success") {
      const updatedMembers = members.filter((_, i) => i !== index);
      form.setValue("members", updatedMembers);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }
  async function handleDeleteTeam() {
    if (!activeTeam?.id) {
      toast.error("No active team selected");
      return;
    }

    try {
      setIsLoading(true);
      const result = await deleteTeam(activeTeam.id);
      if (result.status === "success") {
        removeTeam(activeTeam.id);
        toast.success("Team deleted successfully");
        setIsOpen(false);
        setIsDeleteConfirmOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Failed to delete team:", err);
      toast.error("Failed to delete team");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="hover:cursor-pointer">Edit Team</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter team description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="felx justify-between items-center">
                  <h3 className="font-medium">Team Members</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      //TODO: invite user function
                    }}
                  >
                    <UserPlus className="size-4" />
                    <span>Add member</span>
                  </Button>
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        No team members yet
                      </p>
                    ) : (
                      members.map((member, index) => (
                        <div
                          key={member.user_id}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <div className="truncate">
                            <p className="text-sm font-medium">
                              {member.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={member.role}
                              onValueChange={(value: "admin" | "member") =>
                                handleRoleChange(index, value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveMember(index, member.user_id)
                              }
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={isLoading || !activeTeam}
                >
                  Delete Team
                </Button>
                <Button type="submit" disabled={isLoading || !activeTeam}>
                  {isLoading && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogTitle>Confirm Team Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the team "{activeTeam?.name}"? This
            action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
