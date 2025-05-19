import { AllUserCredentialData, UserTeamWithData } from "@/lib/data/user";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TeamState = {
  data: AllUserCredentialData;
  activeTeam: UserTeamWithData | null;
};

type TeamActions = {
  setActiveTeam: (team: UserTeamWithData | null) => void;
  setTeams: (teams: UserTeamWithData[] | null) => void;
  addTeam: (team: UserTeamWithData) => void;
  getTeamById: (teamId: string) => UserTeamWithData | undefined;
};

const initialTeamState: TeamState = {
  data: { teams: [] },
  activeTeam: null,
};

const useTeamStore = create<TeamState & TeamActions>()(
  immer((set, get) => ({
    ...initialTeamState,

    setActiveTeam: (team) =>
      set((state) => {
        state.activeTeam = team;
      }),

    setTeams: (teams) =>
      set((state) => {
        state.data.teams = teams || [];
      }),
    addTeam: (team) =>
      set((state) => {
        state.data.teams.push(team);
        state.activeTeam = team;
      }),
    getTeamById: (teamId) => {
      return get().data.teams.find((team) => team.id === teamId);
    },
  })),
);

export default useTeamStore;
