import { UserTeam } from "@/lib/data/teams";
import { create } from "zustand";

type TeamStore = {
  teams: UserTeam[];
  activeTeam: UserTeam | null;
  setActiveTeam: (team: UserTeam | null) => void;
  addTeam: (team: UserTeam) => void;
  setTeams: (teams: UserTeam[] | null) => void;
  updateTeam: (id: string, updateTeam: Partial<UserTeam>) => void;
};
const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  activeTeam: null,
  setActiveTeam: (team) => set({ activeTeam: team }),
  setTeams: (teams) => set({ teams: teams ? teams : [] }),
  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
      activeTeam: state.activeTeam === null ? team : state.activeTeam,
    })),
  updateTeam: (id, updatedTeam) =>
    set((state) => {
      const updatedTeams = state.teams.map((team) =>
        team.id === id ? { ...team, ...updatedTeam } : team,
      );

      // Update the active team if it was modified
      const newActiveTeam =
        state.activeTeam?.id === id
          ? updatedTeams.find((team) => team.id === id) || state.activeTeam
          : state.activeTeam;

      return {
        teams: updatedTeams,
        activeTeam: newActiveTeam,
      };
    }),
}));

export default useTeamStore;
