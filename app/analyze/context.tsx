'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Status = 'init' | 'analyzing' | 'analyzed' | 'analyze_error';
interface AnalyzeState {
  reportUrl: string;
  status: Status;
  errorMsg: string;
  setReportUrl: (url: string) => void;
  setStatus: (status: Status) => void;
  setErrorMsg: (message: string) => void;
}
const AnalyzeContext = createContext<AnalyzeState | null>(null);
export function useAnalyze() {
  const state = useContext(AnalyzeContext);
  if (!state) throw new Error('useAnalyze requires ContextProvider');
  return state;
}
export default function ContextProvider({ children }: { children: ReactNode }) {
  const [reportUrl, setReportUrl] = useState('');
  const [status, setStatus] = useState<Status>('init');
  const [errorMsg, setErrorMsg] = useState('');
  return <AnalyzeContext.Provider value={{ reportUrl, status, errorMsg, setReportUrl, setStatus, setErrorMsg }}>{children}</AnalyzeContext.Provider>;
}
