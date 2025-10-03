'use client'

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Plus, X, ExternalLink, User, Link as LinkIcon, Image as ImageIcon, CheckCircle } from "lucide-react";
import { ShowcaseCardState, ProjectLinkItem, buildSubmissionFormData, isSubmissionReady, getValidationErrors } from './types';

const defaultState: ShowcaseCardState = {
    projectName: '',
    authorName: '',
    authorLink: '',
    projectBrief: '',
    links: [],
    defaultLinkId: '',
    coverFile: null,
    avatarFile: null,
    agreedNotice: false,
    confirmedAuthor: false,
    confirmedContent: false,
};

const platformOptions = [
    { value: 'scratch', label: 'Scratch官方社区' },
    { value: '40code', label: '40code' },
    { value: 'ccw', label: '共创世界' },
    { value: 'aerfaying', label: '阿儿法营' },
    { value: 'github', label: 'GitHub' },
    { value: 'other', label: '其他' },
];

export default function ProjectDisplayApplyPage() {
    const [state, setState] = useState<ShowcaseCardState>(defaultState);
    const [submitting, setSubmitting] = useState(false);
    const [newLinkPlatform, setNewLinkPlatform] = useState('scratch');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState({ ...state, coverFile: e.target.files[0] });
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState({ ...state, avatarFile: e.target.files[0] });
        }
    };

    const addLink = () => {
        if (!newLinkUrl.trim()) return;
        const newLink: ProjectLinkItem = {
            id: Date.now().toString(),
            platform: newLinkPlatform,
            url: newLinkUrl.trim(),
        };
        const newLinks = [...state.links, newLink];
        setState({ 
            ...state, 
            links: newLinks,
            defaultLinkId: newLinks.length === 1 ? newLink.id : state.defaultLinkId
        });
        setNewLinkUrl('');
    };

    const removeLink = (id: string) => {
        const newLinks = state.links.filter(l => l.id !== id);
        setState({ 
            ...state, 
            links: newLinks,
            defaultLinkId: state.defaultLinkId === id ? (newLinks[0]?.id || '') : state.defaultLinkId
        });
    };

    const handleSubmit = async () => {
        const errors = getValidationErrors(state);
        if (errors.length > 0) {
            alert('请完成以下必填项：\n\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n'));
            return;
        }
        
        setSubmitting(true);
        try {
            const fd = buildSubmissionFormData(state);
            // 提交到外部 API: api.sjaplus.top/project-apply
            const res = await fetch('https://api.sjaplus.top/project-apply', { 
                method: 'POST', 
                body: fd 
            });
            
            if (!res.ok) {
                // 尝试解析 JSON 错误响应
                let errorMessage = '提交失败';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorMessage;
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        errorMessage += ':\n' + errorData.errors.join('\n');
                    }
                } catch {
                    // 如果无法解析 JSON，使用文本
                    errorMessage = await res.text() || errorMessage;
                }
                alert(errorMessage);
            } else {
                const data = await res.json();
                alert(data.message || '提交成功，等待审核！');
                // 清空表单
                setState(defaultState);
                // 重置文件输入
                if (coverInputRef.current) coverInputRef.current.value = '';
                if (avatarInputRef.current) avatarInputRef.current.value = '';
            }
        } catch (e) {
            console.error('提交错误:', e);
            alert('网络错误，请检查网络连接后重试');
        } finally {
            setSubmitting(false);
        }
    };

    // 获取预览图片URL
    const coverPreviewUrl = state.coverFile ? URL.createObjectURL(state.coverFile) : null;
    const avatarPreviewUrl = state.avatarFile ? URL.createObjectURL(state.avatarFile) : null;
    const getPlatformLabel = (platform: string) => platformOptions.find(p => p.value === platform)?.label || platform;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                            <FileText className="w-4 h-4 mr-2" />
                            作品展位申请
                        </Badge>
                        <h1 className="text-2xl font-bold">SJA作品展位申请</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        填写表单信息，右侧将实时预览您的作品展示卡片
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* 左侧：表单 */}
                    <div className="space-y-6">
                        {/* 基本信息 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    基本信息
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="projectName">作品名称 *</Label>
                                    <Input
                                        id="projectName"
                                        placeholder="请输入作品名称"
                                        value={state.projectName}
                                        onChange={(e) => setState({ ...state, projectName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="authorName">作者名称 *</Label>
                                    <Input
                                        id="authorName"
                                        placeholder="请输入作者名称"
                                        value={state.authorName}
                                        onChange={(e) => setState({ ...state, authorName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="authorLink">作者主页链接 *</Label>
                                    <Input
                                        id="authorLink"
                                        placeholder="https://..."
                                        value={state.authorLink}
                                        onChange={(e) => setState({ ...state, authorLink: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="projectBrief">
                                        作品简介 * (≤20 字)
                                    </Label>
                                    <Textarea
                                        id="projectBrief"
                                        placeholder="简要描述作品特色..."
                                        value={state.projectBrief}
                                        onChange={(e) => setState({ ...state, projectBrief: e.target.value.slice(0, 20) })}
                                        rows={2}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {state.projectBrief.length}/20
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 作品链接 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5" />
                                    作品链接 *
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* 添加链接 */}
                                <div className="space-y-2">
                                    <Label>添加作品链接</Label>
                                    <div className="flex gap-2">
                                        <Select value={newLinkPlatform} onValueChange={setNewLinkPlatform}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {platformOptions.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="https://..."
                                            value={newLinkUrl}
                                            onChange={(e) => setNewLinkUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addLink()}
                                            className="flex-1"
                                        />
                                        <Button onClick={addLink} size="icon" variant="outline">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* 链接列表 */}
                                {state.links.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>已添加的链接</Label>
                                        <div className="space-y-2">
                                            {state.links.map(link => (
                                                <div key={link.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {getPlatformLabel(link.platform)}
                                                            </Badge>
                                                            {link.id === state.defaultLinkId && (
                                                                <Badge variant="default" className="text-xs">
                                                                    默认
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {link.url}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {link.id !== state.defaultLinkId && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setState({ ...state, defaultLinkId: link.id })}
                                                            >
                                                                设为默认
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => removeLink(link.id)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 图片上传 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    图片素材 *
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* 封面图 */}
                                <div className="space-y-2">
                                    <Label>封面图片（4:3 比例）</Label>
                                    <div
                                        className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => coverInputRef.current?.click()}
                                    >
                                        {coverPreviewUrl ? (
                                            <div className="relative aspect-[4/3] rounded overflow-hidden">
                                                <Image
                                                    src={coverPreviewUrl}
                                                    alt="封面预览"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground">
                                                <Upload className="w-8 h-8 mb-2" />
                                                <p className="text-sm">点击上传封面图片</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* 头像图 */}
                                <div className="space-y-2">
                                    <Label>作者头像（1:1 比例）</Label>
                                    <div
                                        className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        {avatarPreviewUrl ? (
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                                    <Image
                                                        src={avatarPreviewUrl}
                                                        alt="头像预览"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <p className="text-sm text-muted-foreground">点击更换头像</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">点击上传头像图片</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 申请须知 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    申请须知
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm space-y-2 text-muted-foreground">
                                    <p>• 作品简介页面需放置 SJA 报告才能通过审核。</p>
                                    <p>• SJA 只展示质量较好的作品。</p>
                                    <p>• 重复提交申请将被否决。</p>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            id="agreedNotice"
                                            checked={state.agreedNotice}
                                            onCheckedChange={(checked) => setState({ ...state, agreedNotice: !!checked })}
                                        />
                                        <Label htmlFor="agreedNotice" className="text-sm cursor-pointer">
                                            我已阅读并同意申请须知。
                                        </Label>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            id="confirmedAuthor"
                                            checked={state.confirmedAuthor}
                                            onCheckedChange={(checked) => setState({ ...state, confirmedAuthor: !!checked })}
                                        />
                                        <Label htmlFor="confirmedAuthor" className="text-sm cursor-pointer">
                                            我确认所提交作品为个人原创作品，请作品内容符合法律法规。
                                        </Label>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? '提交中...' : '提交申请'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 右侧：实时预览 */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg">实时预览</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    这是您的作品在展示页面的样子
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* 预览卡片 - 与 ProjectDisplay 组件样式完全一致 */}
                                <div className="group w-56 mx-auto rounded-2xl border border-border/60 bg-[hsl(var(--card)_/_85%)] hover:bg-[hsl(var(--card)_/_95%)] transition-colors overflow-hidden shadow-md hover:shadow-primary/20 ring-1 ring-border/40 hover:ring-primary/50 duration-500">
                                    {/* Author and Project Info */}
                                    <div className="flex p-3 pb-2 gap-3 items-center">
                                        <div className="flex-shrink-0">
                                            {avatarPreviewUrl ? (
                                                <Image
                                                    width={36}
                                                    height={36}
                                                    src={avatarPreviewUrl}
                                                    className="w-9 h-9 rounded-full ring-2 ring-primary/30 object-cover"
                                                    alt={state.authorName || '作者'}
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full ring-2 ring-primary/30 bg-muted flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-white group-hover:text-primary line-clamp-1 tracking-wide">
                                                {state.projectName || '作品名称'}
                                            </h3>
                                            <p className="text-xs text-muted-foreground hover:text-primary/80 truncate leading-tight">
                                                {state.authorName || '作者名称'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Project Poster */}
                                    <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                                        {coverPreviewUrl ? (
                                            <Image
                                                width={224}
                                                height={168}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] group-hover:rotate-[0.3deg]"
                                                src={coverPreviewUrl}
                                                alt={state.projectName || '封面'}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <div className="text-center">
                                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">等待上传封面</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Brief */}
                                    <div className="p-3 pt-2">
                                        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.9rem]">
                                            {state.projectBrief || '暂无简介'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
