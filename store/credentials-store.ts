import { FetchCredential } from "@/lib/data/credentials";
import { create } from "zustand";

//
type CredentialsStore = {
  credentials: FetchCredential[];
  setCredentials: (credentials: FetchCredential[] | null) => void;
  addCredential: (credential: FetchCredential) => void;
};

const useCredentialsStore = create<CredentialsStore>((set) => ({
  credentials: [],
  setCredentials: (credentials) =>
    set({ credentials: credentials ? credentials : [] }),
  addCredential: (credential) =>
    set((state) => ({
      credentials: [...state.credentials, credential],
    })),
}));

export default useCredentialsStore;
