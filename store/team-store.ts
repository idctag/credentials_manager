import { GroupWithCredentials } from "@/lib/data/groups";
import { AllUserCredentialData, UserTeamWithData } from "@/lib/data/user";
import { create } from "zustand";

type TeamStore = {
  data: AllUserCredentialData;
  activeTeam: UserTeamWithData | null;
  setActiveTeam: (team: UserTeamWithData | null) => void;
  addTeam: (team: UserTeamWithData) => void;
  setTeams: (teams: UserTeamWithData[] | null) => void;
  addGroup: (group: GroupWithCredentials) => void;
};
const useTeamStore = create<TeamStore>((set) => ({
  data: { teams: [] },
  activeTeam: null,
  setActiveTeam: (team) => set({ activeTeam: team }),
  setTeams: (teams) => set({ data: { teams: teams || [] } }),
  addTeam: (team) =>
    set((state) => ({
      data: { teams: [...state.data.teams, team] },
      activeTeam: team,
    })),
  addGroup: (group) =>
    set((state) => {
      if (!state.activeTeam) {
        console.warn("No active team selected");
        return state;
      }
      const updateTeams = state.data.teams.map((team) =>
        team.id === state.activeTeam?.id
          ? { ...team, groups: [...team.groups, group] }
          : team,
      );
      const updateActiveTeam = {
        ...state.activeTeam,
        groups: [...state.activeTeam.groups, group],
      };
      return {
        data: { teams: updateTeams },
        activeTeam: updateActiveTeam,
      };
    }),
}));

export default useTeamStore;
