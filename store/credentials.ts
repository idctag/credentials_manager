import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import useTeamStore from "./teams";
import { FetchCredentialType } from "@/lib/data/credentials";

// Types
type CredentialState = {
  // Empty state - we'll use the team store for actual storage
};

type CredentialActions = {
  removeCredential: (credentialId: string) => void;
  addCredential: (credential: FetchCredentialType, groupId?: string) => void;
  // Add more credential-related actions here
};

// Create the credential store
const useCredentialStore = create<CredentialState & CredentialActions>()(
  immer((set, get) => ({
    // Actions
    removeCredential: (credentialId) => {
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
          state.data.teams[teamIndex].credentials = state.data.teams[
            teamIndex
          ].credentials.filter((cred) => cred.id !== credentialId);
        }

        if (state.activeTeam) {
          state.activeTeam.credentials = state.activeTeam.credentials.filter(
            (cred) => cred.id !== credentialId,
          );
        }
      });
    },

    // Example of adding a new credential action
    addCredential: (credential, groupId) => {
      const { activeTeam } = useTeamStore.getState();

      if (!activeTeam) {
        console.warn("No active team selected");
        return;
      }

      useTeamStore.setState((state) => {
        const teamIndex = state.data.teams.findIndex(
          (team) => team.id === activeTeam.id,
        );

        if (groupId !== undefined) {
          const groupIndex = state.data.teams[teamIndex].groups.findIndex(
            (g) => g.id === groupId,
          );
          state.data.teams[teamIndex].groups[groupIndex].credentials?.push(
            credential,
          );
        }
        if (state.activeTeam?.groups) {
          const activeGroupIndex = state.activeTeam.groups.findIndex(
            (group) => group.id === groupId,
          );

          if (!state.activeTeam.groups[activeGroupIndex].credentials) {
            state.activeTeam.groups[activeGroupIndex].credentials = [];
          }
          state.activeTeam.groups[activeGroupIndex].credentials.push(
            credential,
          );
        } else {
          if (teamIndex >= 0) {
            state.data.teams[teamIndex].credentials.push(credential);
          }

          if (state.activeTeam) {
            state.activeTeam.credentials.push(credential);
          }
        }
      });
    },
  })),
);

export default useCredentialStore;
