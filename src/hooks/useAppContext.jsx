import { useContext } from "react";
import AppContext from "../context/AppContextInternal";

export const useAppContext = () => useContext(AppContext);

export default useAppContext;
