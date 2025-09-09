import { useContext } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, FileImage } from "lucide-react";
import { GlobalContext } from "./context";
import { cn } from "@/lib/utils";

export default function ModernAnalyzeResult() {
    const states = useContext(GlobalContext);
    const status = states.status();
    const reportUrl = states.reportUrl();
    const errorMsg = states.errorMsg();

    const getStatusIcon = () => {
        switch (status) {
            case 'analyzing':
                return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
            case 'analyzed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'analyze_error':
                return <AlertCircle className="h-5 w-5 text-destructive" />;
            default:
                return <FileImage className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'analyzing':
                return '正在分析...';
            case 'analyzed':
                return '分析完成';
            case 'analyze_error':
                return '分析出错';
            default:
                return '等待开始';
        }
    };

    const getStatusVariant = () => {
        switch (status) {
            case 'analyzing':
                return 'default';
            case 'analyzed':
                return 'default';
            case 'analyze_error':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {getStatusIcon()}
                        分析结果
                    </span>
                    <Badge variant={getStatusVariant()}>
                        {getStatusText()}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {status === 'init' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileImage className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            暂无报告，上传文件试试吧！
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            请在左侧上传您的作品文件并点击开始分析
                        </p>
                    </div>
                )}

                {status === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            正在分析中...
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            请稍等，我们正在处理您的作品文件
                        </p>
                    </div>
                )}

                {status === 'analyze_error' && errorMsg && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errorMsg}
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'analyzed' && reportUrl && (
                    <div className="space-y-4">
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                分析完成！您可以查看下方的报告图片，或下载/复制到剪贴板。
                            </AlertDescription>
                        </Alert>
                        
                        <div className="rounded-lg border bg-card overflow-hidden">
                            <Image 
                                src={reportUrl} 
                                alt="分析报告" 
                                width={800}
                                height={600}
                                className="w-full h-auto"
                                style={{ maxHeight: '600px', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
