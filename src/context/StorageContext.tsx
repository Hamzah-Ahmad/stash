// context/StorageContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import useStorage from "../hooks/useStorage";

type StorageContextType = ReturnType<typeof useStorage>;

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const storage = useStorage();
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageContext must be used within a StorageProvider");
  }
  return context;
};
