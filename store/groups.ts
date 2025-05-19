import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { GroupWithCredentials } from "@/lib/data/groups";
import useTeamStore from "./teams";

// Types
type GroupState = {
  // Empty state - we'll use the team store for actual storage
};

type GroupActions = {
  addGroup: (group: GroupWithCredentials) => void;
  removeGroup: (groupId: string) => void;
};

// Create the group store
const useGroupStore = create<GroupState & GroupActions>()(
  immer((set, get) => ({
    // Actions
    addGroup: (group) => {
      const { activeTeam } = useTeamStore.getState();

      if (!activeTeam) {
        console.warn("No active team selected");
        return;
      }

      useTeamStore.setState((state) => {
        const teamIndex = state.data.teams.findIndex(
          (team) => team.id === activeTeam.id,
        );

        if (teamIndex >= 0) {
          state.data.teams[teamIndex].groups.push(group);
        }

        if (state.activeTeam) {
          state.activeTeam.groups.push(group);
        }
      });
    },

    removeGroup: (groupId) => {
      const { activeTeam } = useTeamStore.getState();

      if (!activeTeam) {
        console.warn("No active team selected");
        return;
      }

      useTeamStore.setState((state) => {
        const teamIndex = state.data.teams.findIndex(
          (team) => team.id === activeTeam.id,
        );

        if (teamIndex >= 0) {
          state.data.teams[teamIndex].groups = state.data.teams[
            teamIndex
          ].groups.filter((group) => group.id !== groupId);
        }

        if (state.activeTeam) {
          state.activeTeam.groups = state.activeTeam.groups.filter(
            (group) => group.id !== groupId,
          );
        }
      });
    },
  })),
);

export default useGroupStore;
