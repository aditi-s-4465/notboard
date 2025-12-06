import React, { useState, createContext } from "react";

interface AppContextProps{
  children: React.ReactNode
}

export const AppContext = createContext({email: "",setEmail: (email: string) => {}, collection: "",
setCollection: (name: string) => {},selectedGameName: "", setSelectedGameName: (name: string) => {},
});
export const AppProvider = ({ children }: AppContextProps) => {
  const [email, setEmail] = useState("");
  const [collection, setCollection] = useState("");
  const [selectedGameName, setSelectedGameName] = useState("");
  return (
      <AppContext.Provider value={{ email,setEmail, collection, setCollection, selectedGameName, setSelectedGameName}}>
      {children}
      </AppContext.Provider>
  );
};