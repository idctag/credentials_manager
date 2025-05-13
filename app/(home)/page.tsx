"use client";
import useTeamStore from "@/store/team-store";
import { GroupTable } from "../tables/groups/data-table";
import { groupColumns } from "../tables/groups/colums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CredentialTable } from "../tables/credentials/data-table";
import { credentialColumns } from "../tables/credentials/columns";

export default function Home() {
  const { activeTeam } = useTeamStore();
  return (
    <div>
      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>
        <TabsContent value="groups">
          <GroupTable columns={groupColumns} data={activeTeam?.groups || []} />
        </TabsContent>
        <TabsContent value="credentials">
          <CredentialTable
            columns={credentialColumns}
            data={activeTeam?.credentials || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
