import React, { useState, createContext } from "react";

interface AppContextProps{
  children: React.ReactNode
}

export const AppContext = createContext({email: "",setEmail: (email: string) => {}, collection: "",
setCollection: (name: string) => {},
});
export const AppProvider = ({ children }: AppContextProps) => {
  const [email, setEmail] = useState("");
  const [collection, setCollection] = useState("");
  return (
      <AppContext.Provider value={{ email,setEmail, collection, setCollection}}>
      {children}
      </AppContext.Provider>
  );
};