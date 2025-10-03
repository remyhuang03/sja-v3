'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernAnalyzeMenu from "./AnalyzeMenu";
import ModernAnalyzeResult from "./AnalyzeResult";
import ContextProvider from "./context";

export default function ModernAnalyzePage() {
    return (
        <ContextProvider>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">SJA作品分析器</h1>
                    <p className="text-muted-foreground">上传您的Scratch作品文件，获得详细的分析报告</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    <div className="space-y-6">
                        <ModernAnalyzeMenu />
                    </div>
                    <div className="space-y-6">
                        <ModernAnalyzeResult />
                    </div>
                </div>
            </div>
        </ContextProvider>
    );
}
