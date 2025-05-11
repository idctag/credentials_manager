import { GroupWithCredentials } from "@/lib/data/groups";
import { create } from "zustand";

type GroupStore = {
  groups: GroupWithCredentials[];
  setGroups: (groups: GroupWithCredentials[] | null) => void;
};

const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups: groups ? groups : [] }),
}));

export default useGroupStore;
