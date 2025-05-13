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
  removeGroup: (groupId: string) => void;
  removeCredential: (credentialId: string) => void;
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
  removeGroup: (groupId) =>
    set((state) => {
      if (!state.activeTeam) {
        console.warn("No active team selected");
        return state;
      }
      const updateTeams = state.data.teams.map((team) =>
        team.id === state.activeTeam?.id
          ? {
              ...team,
              groups: team.groups.filter((group) => group.id !== groupId),
            }
          : team,
      );
      const updateActiveTeam = {
        ...state.activeTeam,
        groups: state.activeTeam.groups.filter((group) => group.id !== groupId),
      };
      return {
        data: { teams: updateTeams },
        activeTeam: updateActiveTeam,
      };
    }),
  removeCredential: (credentialId) =>
    set((state) => {
      if (!state.activeTeam) {
        console.warn("No active team selected");
        return state;
      }
      const updateTeams = state.data.teams.map((team) =>
        team.id === state.activeTeam?.id
          ? {
              ...team,
              credentials: team.credentials.filter(
                (cred) => cred.id !== credentialId,
              ),
            }
          : team,
      );
      const updateActiveTeam = {
        ...state.activeTeam,
        credentials: state.activeTeam.credentials.filter(
          (cred) => cred.id !== credentialId,
        ),
      };
      return {
        data: { teams: updateTeams },
        activeTeam: updateActiveTeam,
      };
    }),
}));

export default useTeamStore;
