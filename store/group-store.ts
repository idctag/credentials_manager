import { TeamGroupsWithCreds } from "@/lib/data/groups";
import { create } from "zustand";

type GroupStore = {
  groups: TeamGroupsWithCreds[];
  setGroups: (groups: TeamGroupsWithCreds[] | null) => void;
};

const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups: groups ? groups : [] }),
}));

export default useGroupStore;
