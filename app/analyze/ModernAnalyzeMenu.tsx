import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, Settings, Download, Copy, FileText } from "lucide-react";
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
                throw new Error('您所上传的文件已超出大小限制，请解压作品后直接上传 project.json 文件。');
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
                            accept=".sb3,.sb2,.json,.cc3,application/json,application/octet-stream"
                            maxSize={50}
                        />
                    </div>

                    <Separator />

                    {/* 排序设置 */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            类型排序
                        </Label>
                        <RadioGroup value={sortOrder} onValueChange={setSortOrder}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="desc" id="sort-desc" />
                                <Label htmlFor="sort-desc">降序排序</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="default" id="sort-default" />
                                <Label htmlFor="sort-default">默认</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Separator />

                    {/* 显示积木数 */}
                    <div className="space-y-3">
                        <Label>显示积木数</Label>
                        <RadioGroup value={rankCategory} onValueChange={setRankCategory}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="top12" id="rank-top12" />
                                <Label htmlFor="rank-top12">排名前12的积木</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="classic" id="rank-classic" />
                                <Label htmlFor="rank-classic">经典类型</Label>
                            </div>
                        </RadioGroup>
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
