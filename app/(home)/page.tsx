"use client";
import useTeamStore from "@/store/team-store";
import { GroupTable } from "../tables/groups/data-table";
import { groupColumns } from "../tables/groups/colums";

export default function Home() {
  const { activeTeam } = useTeamStore();
  return (
    <div>
      <GroupTable columns={groupColumns} data={activeTeam?.groups || []} />
    </div>
  );
}
