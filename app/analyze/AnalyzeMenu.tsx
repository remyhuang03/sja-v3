import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Settings, Download, Copy, FileText, Hash } from "lucide-react";
import { GlobalContext } from "./context";
import FileUploadZone from "./FileUploadZone";

export default function ModernAnalyzeMenu() {
    const states = useContext(GlobalContext);
    const [files, setFiles] = useState<FileList | null>(null);
    const [sortOrder, setSortOrder] = useState("desc");
    const [rankCategory, setRankCategory] = useState("top12");
    const [enableClickableReport, setEnableClickableReport] = useState(false);

    function submitHandler(e: React.FormEvent) {
        e.preventDefault();
        if (states.status() === 'analyzing') return;

        states.setStatus('analyzing');

        const formData = new FormData();
        if (files && files[0]) {
            formData.append("file", files[0]);
        } else {
            states.setErrorMsg("请先上传作品！");
            states.setStatus('analyze_error');
            return;
        }
        
        formData.append("is_sort", sortOrder);
        formData.append("is_high_rank_cate", rankCategory);

        fetch('/api/v2/analyze', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.status === 413) {
                throw new Error('您所上传的文件已超出大小限制，请尝试解压作品后直接上传 project.json 文件。');
            }
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then(data => {
            if (data.status === 'ok') {
                states.setReportUrl(data.token);
                states.setStatus('analyzed');
            } else {
                states.setErrorMsg(data.msg);
                states.setStatus('analyze_error');
            }
        }).catch(error => {
            states.setErrorMsg(error.message);
            states.setStatus('analyze_error');
        });
    }

    function handleMarkdownCopy() {
        const url = states.reportUrl();
        let md = "";
        if (enableClickableReport) {
            md = `[![](${url})](${url})`;
        } else {
            md = `[![](${url})](https://sjaplus.top)`;
        }

        navigator.clipboard.writeText(md).then(() => {
            alert("Markdown 代码复制成功，可直接粘贴到作品简介。");
        }, () => {
            alert("Markdown 代码复制失败！");
        });
    }

    const isAnalyzing = states.status() === 'analyzing';
    const isAnalyzed = states.status() === 'analyzed';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    作品上传与设置
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={submitHandler} className="space-y-6">
                    {/* 文件上传区域 */}
                    <div className="space-y-2">
                        <Label>上传作品文件</Label>
                        <FileUploadZone
                            onFileChange={setFiles}
                            currentFile={files?.[0] || null}
                            accept=".sb3,.json,.cc3,application/json,application/octet-stream"
                            maxSize={50}
                        />
                    </div>

                    <Separator />

                    {/* 排序设置 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="flex items-center gap-2 sm:min-w-[100px]">
                            <Settings className="h-4 w-4" />
                            类型排序
                        </Label>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="sm:flex-1">
                                <SelectValue placeholder="选择排序方式" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">降序排序</SelectItem>
                                <SelectItem value="default">默认</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* 显示积木数 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="flex items-center gap-2 sm:min-w-[100px]">
                            <Hash className="h-4 w-4" />
                            显示积木数
                        </Label>
                        <Select value={rankCategory} onValueChange={setRankCategory}>
                            <SelectTrigger className="sm:flex-1">
                                <SelectValue placeholder="选择显示方式" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="top12">排名前12的积木</SelectItem>
                                <SelectItem value="classic">经典类型</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* 分析按钮 */}
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isAnalyzing || !files}
                        size="lg"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                                分析中...
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4 mr-2" />
                                开始分析
                            </>
                        )}
                    </Button>
                </form>

                {/* 分析完成后的操作 */}
                {isAnalyzed && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="clickable-report"
                                    checked={enableClickableReport}
                                    onCheckedChange={(checked) => setEnableClickableReport(checked as boolean)}
                                />
                                <Label htmlFor="clickable-report" className="text-sm">
                                    为报告图片提供点击放大功能 (推荐用于CCW的小简介栏显示)
                                </Label>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleMarkdownCopy}
                                    className="flex-1"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    复制Markdown
                                </Button>
                                
                                <Button 
                                    variant="outline"
                                    onClick={() => window.open(states.reportUrl(), '_blank')}
                                    className="flex-1"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    下载报告图
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
