'use client'

// TODO: change title to '作品分析器'
import Menu from "./Menu"
import Result from "./Result"
import ContextProvider from "./context"

// type Status = 'init' | 'analyzing' | 'analyzed' | 'analyze_error';
// type ReportImageURL = string | undefined;
// type ErrorMsg = string | undefined;

export default function Page() {
    return <ContextProvider>
        <h1 className="text-xl text-center m-5">SJA作品分析器</h1>
        <div className="flex justify-center flex-wrap md:flex-nowrap">
            <Result className="flex-1 min-w-[300px]"/>
            <Menu className="flex-1 min-w-[350px]"/>
        </div>
    </ContextProvider>
}