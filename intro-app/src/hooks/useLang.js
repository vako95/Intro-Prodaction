import { useContext } from "react";
import { LangContext } from "../context/lang.jsx";

export const useLang = () => {
    const context = useContext(LangContext);
    
    if (!context) {
        throw new Error("useLang must be used within LangContextProvider");
    }
    
    return context;
};
