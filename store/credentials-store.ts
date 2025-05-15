import { FetchCredentialType } from "@/lib/data/credentials";
import { create } from "zustand";

//
type CredentialsStore = {
  credentials: FetchCredentialType[];
  setCredentials: (credentials: FetchCredentialType[] | null) => void;
  addCredential: (credential: FetchCredentialType) => void;
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
