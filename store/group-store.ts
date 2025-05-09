import { FetchGroupWithCredentials } from "@/lib/data/groups";
import { create } from "zustand";

type GroupStore = {
  groups: FetchGroupWithCredentials[];
  setGroups: (groups: FetchGroupWithCredentials[] | null) => void;
};

const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups: groups ? groups : [] }),
}));

export default useGroupStore;
