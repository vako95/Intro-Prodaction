import { createContext, useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LocalStorageService } from "../services/localstorage.js";
import { AVAILABLE_LANGS, DEFAULT_LANG, LANG_KEY } from "../constants/lang.js";
import { translations } from "../lang/lang.js";

const LangContext = createContext(null);

const LangContextProvider = ({ children }) => {
    const queryClient = useQueryClient();
    
    const [lang, setLang] = useState(() => {
        return LocalStorageService.get(LANG_KEY) || DEFAULT_LANG;
    });

    const getLang = useCallback(() => {
        return AVAILABLE_LANGS.find(l => l.code === lang);
    }, [lang]);

    const getTranslate = useCallback((...keys) => {
        const value = keys.reduce((obj, key) => obj?.[key], translations);
        return value?.[lang] || keys.join('.');
    }, [lang]);

    const changeLanguage = useCallback(async (newLang) => {
        const isValid = AVAILABLE_LANGS.some(l => l.code === newLang);
        const validLang = isValid ? newLang : DEFAULT_LANG;

        LocalStorageService.set(LANG_KEY, validLang);
        setLang(validLang);
        
        await queryClient.invalidateQueries();
        await queryClient.refetchQueries();
    }, [queryClient]);

    const value = useMemo(() => ({
        getLang,
        changeLanguage,
        getTranslate,
        lang
    }), [getLang, changeLanguage, getTranslate, lang]);

    return (
        <LangContext.Provider value={value}>
            {children}
        </LangContext.Provider>
    );
};

export { LangContextProvider, LangContext };
