import { getTeams } from "@/lib/data/teams";
import AppSidebar from "./app-sidebar";

export default async function SideBarWrapper() {
  const teams = await getTeams();
  return <AppSidebar initialTeams={teams} />;
}
