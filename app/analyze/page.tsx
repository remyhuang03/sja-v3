'use client'

// TODO: change title to '作品分析器'
import Menu from "./Menu"
import Result from "./Result"

import { useState } from "react"

type Status = 'init' | 'analyzing' | 'analyzed' | 'analyze_error';
type ReportImageURL = string | undefined;
type ErrorMsg = string | undefined;

export default function Page() {
    const [status, setStatus] = useState<Status>('init');
    const [reportImageURL, setReportImageURL] = useState<ReportImageURL>(undefined);
    const [errorMsg, setErrorMsg] = useState<ErrorMsg>(undefined);

    return <div>
        <h1 className="text-xl text-center m-5">SJA作品分析器</h1>
        <div className="flex justify-center flex-wrap md:flex-nowrap">
            <Result status={status} report={reportImageURL} errorMsg={errorMsg} className="flex-1 min-w-[300px]"/>
            <Menu setReport={setReportImageURL} status={status} setStatus={setStatus} setErrorMsg={setErrorMsg} className="flex-1 min-w-[350px]"/>
        </div>
    </div>
}