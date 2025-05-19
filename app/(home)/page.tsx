"use client";
import useTeamStore from "@/store/teams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/tables/data-table";
import { groupColumns } from "@/components/tables/groups/colums";
import { credentialColumns } from "@/components/tables/credentials/columns";
import EditTeamButton from "@/components/forms/edit-team";

export default function Home() {
  const { activeTeam } = useTeamStore();
  return (
    <div className="mt-10">
      <Tabs defaultValue="groups">
        <div className="flex w-full justify-between">
          <TabsList className="flex">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>
          <EditTeamButton />
        </div>
        <TabsContent value="groups">
          <DataTable columns={groupColumns} data={activeTeam?.groups || []} />
        </TabsContent>
        <TabsContent value="credentials">
          <DataTable
            columns={credentialColumns}
            data={activeTeam?.credentials || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
