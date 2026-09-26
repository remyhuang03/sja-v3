import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernVersionItem from "./ModernVersionItem";
import logData from '@/data/update-log/log.json';

export default function Page() {
    const log = logData as { version: string; date: string; update: (string | [string, string])[] }[];
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">更新日志</h1>
                <p className="text-muted-foreground">查看SJA Plus的最新功能更新和改进</p>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                    {log.map((version, index) => (
                        <ModernVersionItem 
                            key={version.version}
                            version={version.version} 
                            date={version.date} 
                            update={version.update} 
                            isFirst={index === 0} 
                            isLast={index === log.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}