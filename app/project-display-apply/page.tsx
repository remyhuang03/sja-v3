'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Smartphone } from "lucide-react";
// Legacy components retained but new UX centers around EditableShowcaseCard
import EditableShowcaseCard, { defaultShowcaseState } from './EditableShowcaseCard';
import { ShowcaseCardState, buildSubmissionFormData, isSubmissionReady } from './types';

export default function ProjectDisplayApplyPage() {
    const [cardState, setCardState] = useState<ShowcaseCardState>(defaultShowcaseState);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!isSubmissionReady(cardState)) return;
        setSubmitting(true);
        try {
            const fd = buildSubmissionFormData(cardState);
            const res = await fetch('/api/v2/project-display-apply', { method: 'POST', body: fd });
            if (!res.ok) {
                const text = await res.text();
                alert('提交失败: ' + text);
            } else {
                alert('提交成功，等待审核');
                setCardState(defaultShowcaseState);
            }
        } catch (e) {
            console.error(e);
            alert('网络错误');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">
                    <FileText className="w-4 h-4 mr-2" />
                    作品展位申请
                </Badge>
                <h1 className="text-3xl font-bold mb-2">SJA作品展位申请</h1>
                <p className="text-muted-foreground">
                    展示您的优秀Scratch作品，与社区分享创作成果
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <EditableShowcaseCard value={cardState} onChange={setCardState} onSubmit={() => handleSubmit()} />
                </div>
                <div className="space-y-6 text-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle>申请须知 & 同意</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                                <li>SJA只展示质量较好的作品</li>
                                <li>请不要重复申请</li>
                                <li>请准确填写申请表，错误将导致否决</li>
                                <li>作品简介页面需放置 SJA 报告</li>
                            </ol>
                            <div className="pt-2 space-y-2">
                                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={cardState.agreedNotice} onChange={e=>setCardState({...cardState, agreedNotice:e.target.checked})}/> 已阅读申请须知</label>
                                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={cardState.confirmedAuthor} onChange={e=>setCardState({...cardState, confirmedAuthor:e.target.checked})}/> 我确认作者授权</label>
                                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={cardState.confirmedContent} onChange={e=>setCardState({...cardState, confirmedContent:e.target.checked})}/> 作品内容健康</label>
                            </div>
                            <button disabled={!isSubmissionReady(cardState)||submitting} onClick={handleSubmit} className="w-full rounded bg-primary text-primary-foreground py-2 text-sm disabled:opacity-40">{submitting? '提交中...':'提交申请'}</button>
                        </CardContent>
                    </Card>
                    <Card className="border-dashed">
                        <CardHeader><CardTitle>状态</CardTitle></CardHeader>
                        <CardContent className="text-xs space-y-1">
                            <div>必填完成: {isSubmissionReady(cardState)? '✅':'⚠️ 未完成'}</div>
                            <div>链接数量: {cardState.links.length}</div>
                            <div>默认链接: {cardState.defaultLinkId? '已设定':'未设定'}</div>
                            <div>封面: {cardState.coverFile? '✔':'—'} / 头像: {cardState.avatarFile? '✔':'—'}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
