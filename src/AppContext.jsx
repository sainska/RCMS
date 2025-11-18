import React, { useState } from "react";
import AppContext from "./context/AppContextInternal";

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, companyId, role, ... }
  const [selectedProject, setSelectedProject] = useState(null); // { projectId, ... }

  return (
    <AppContext.Provider value={{ user, setUser, selectedProject, setSelectedProject }}>
      {children}
    </AppContext.Provider>
  );
};

// Re-export the hook so both `import { useAppContext } from './AppContext'`
// and the new hook path work at runtime.
export { default as useAppContext } from "./hooks/useAppContext";
