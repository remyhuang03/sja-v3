import { createContext, useState } from "react";

type statusType = 'init' | 'analyzing' | 'analyzed' | 'analyze_error';

interface GlobalContextType {
    setReportUrl: (url: string) => void;
    setStatus: (status:statusType ) => void;
    setErrorMsg: (msg: string) => void;
    reportUrl: () => string;
    status: () => string;
    errorMsg: () => string;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export default function ContextProvider({ children }) {
    const [reportUrl, setReportUrl] = useState<string | undefined>("");
    const [status, setStatus] = useState<statusType>("init");
    const [errorMsg, setErrorMsg] = useState<string | undefined>("");

    const context = {
        "setReportUrl": setReportUrl,
        "setStatus": setStatus,
        "setErrorMsg": setErrorMsg,
        "reportUrl": () => { return reportUrl; },
        "status": () => { return status; },
        "errorMsg": () => { return errorMsg }
    }

    return (<GlobalContext.Provider value={context}>
        {children}
    </ GlobalContext.Provider>);
}