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
  updateTeamStore: (updatedTeam: UserTeamWithData) => void;
  removeTeam: (teamId: string) => void;
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
    updateTeamStore: (updatedTeam) =>
      set((state) => {
        const teamIndex = state.data.teams.findIndex(
          (team) => team.id === updatedTeam.id,
        );
        if (teamIndex !== -1) {
          state.data.teams[teamIndex] = {
            ...state.data.teams[teamIndex],
            ...updatedTeam,
          };
          if (state.activeTeam && state.activeTeam.id === updatedTeam.id) {
            state.activeTeam = {
              ...state.activeTeam,
              ...updatedTeam,
            };
          }
        }
      }),
    removeTeam: (teamId) =>
      set((state) => {
        state.data.teams = state.data.teams.filter(
          (team) => team.id !== teamId,
        );
        if (state.activeTeam && state.activeTeam.id === teamId) {
          state.activeTeam =
            state.data.teams.length > 0 ? state.data.teams[0] : null;
        }
      }),
  })),
);

export default useTeamStore;
