import React, { useState, createContext, useEffect } from "react";

interface AppContextProps {
  children: React.ReactNode;
}
interface AppContextType {
  email: string;
  setEmail: (email: string) => void;
  collection: string;
  setCollection: (name: string) => void;
  selectedGameName: string;
  setSelectedGameName: (name: string) => void;
}

export const AppContext = createContext<AppContextType>({
  email: "",
  setEmail: () => {},
  collection: "",
  setCollection: () => {},
  selectedGameName: "",
  setSelectedGameName: () => {},
});

export const AppProvider = ({ children }: AppContextProps) => {
  const [email, setEmailState] = useState(() => localStorage.getItem("userEmail") || "");
  const [collection, setCollectionState] = useState(() => localStorage.getItem("userCollection") || "");
  const [selectedGameName, setSelectedGameName] = useState("");

  //wrapper function to set email both in state and localStorage
  const setEmail = (newEmail: string) => {
    localStorage.setItem("userEmail", newEmail);
    setEmailState(newEmail);
  };

  const setCollection = (newCollection: string) => {
    localStorage.setItem("userCollection", newCollection);
    setCollectionState(newCollection);
  };

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        collection,
        setCollection,
        selectedGameName,
        setSelectedGameName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};