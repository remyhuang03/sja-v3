'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Plus, Trash2, Upload, FileText, Link, CheckCircle, Star, Info, Edit, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectLink {
    id: string;
    platform: string;
    url: string;
}

interface FormData {
    projectName: string;
    authorName: string;
    projectBrief: string;
    projectLinks: ProjectLink[];
    defaultLinkId: string;
    personalLink: string;
    coverImage: File | null;
    avatarImage: File | null;
    agreedToTerms: boolean;
    confirmedAuthor: boolean;
    confirmedContent: boolean;
}

interface SidePanelProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
}

export default function ModernSidePanel({ formData, setFormData }: SidePanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateFormData = (field: keyof FormData, value: string | boolean | File | null | ProjectLink[]) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // 链接管理函数
    const addProjectLink = () => {
        const newLink: ProjectLink = {
            id: Date.now().toString(),
            platform: '',
            url: ''
        };
        updateFormData('projectLinks', [...formData.projectLinks, newLink]);
    };

    const removeProjectLink = (linkId: string) => {
        updateFormData('projectLinks', formData.projectLinks.filter(link => link.id !== linkId));
    };

    const updateProjectLink = (linkId: string, field: 'platform' | 'url', value: string) => {
        const updatedLinks = formData.projectLinks.map(link => 
            link.id === linkId ? { ...link, [field]: value } : link
        );
        updateFormData('projectLinks', updatedLinks);
    };

    // 文件上传函数
    const handleImageUpload = (field: 'coverImage' | 'avatarImage', file: File | null) => {
        updateFormData(field, file);
    };

    // 表单提交
    const handleSubmit = async () => {
        // 验证必填字段
        if (!formData.projectName || !formData.authorName) {
            alert('请填写必填字段');
            return;
        }

        if (!formData.agreedToTerms) {
            alert('请先同意申请须知');
            return;
        }

        if (!formData.confirmedAuthor || !formData.confirmedContent) {
            alert('请确认所有验证项');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('projectName', formData.projectName);
            submitData.append('authorName', formData.authorName);
            submitData.append('projectBrief', formData.projectBrief);
            submitData.append('projectLinks', JSON.stringify(formData.projectLinks));
            submitData.append('defaultLinkId', formData.defaultLinkId);
            submitData.append('personalLink', formData.personalLink);
            
            if (formData.coverImage) {
                submitData.append('coverImage', formData.coverImage);
            }
            if (formData.avatarImage) {
                submitData.append('avatarImage', formData.avatarImage);
            }

            const response = await fetch('/api/v2/project-display-apply', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                alert('申请提交成功！请等待审核。');
                // 重置表单
                setFormData({
                    projectName: '',
                    authorName: '',
                    projectBrief: '',
                    projectLinks: [],
                    defaultLinkId: '',
                    personalLink: '',
                    coverImage: null,
                    avatarImage: null,
                    agreedToTerms: false,
                    confirmedAuthor: false,
                    confirmedContent: false
                });
            } else {
                const errorData = await response.text();
                alert(`提交失败：${errorData}`);
            }
        } catch (error) {
            alert('提交失败，请检查网络连接');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 申请须知 */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                        <FileText className="w-5 h-5" />
                        申请须知
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                            请仔细阅读以下申请条件，确保您的作品符合展示要求
                        </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                            <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">SJA只展示质量较好的作品</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">请不要重复申请</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                            <Edit className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">请准确填写申请表，如填写有误，申请将被否决</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                            <BarChart3 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">作品简介页面必须已经放置 SJA 报告</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 bg-white rounded-lg border border-amber-200">
                        <Checkbox 
                            id="terms"
                            checked={formData.agreedToTerms}
                            onCheckedChange={(checked) => updateFormData('agreedToTerms', checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer">
                            我已阅读并同意申请须知
                        </Label>
                        {formData.agreedToTerms && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                </CardContent>
            </Card>

            {/* 作品链接管理 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Link className="w-5 h-5" />
                            作品链接管理
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addProjectLink}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            添加链接
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.projectLinks.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            <Link className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm">暂无作品链接</p>
                            <p className="text-xs">点击上方按钮添加作品链接</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {formData.projectLinks.map((link) => (
                                <div key={link.id} className="flex gap-2 p-3 border rounded-lg bg-muted/30">
                                    <div className="flex-1 space-y-2">
                                        <Select 
                                            value={link.platform} 
                                            onValueChange={(value) => updateProjectLink(link.id, 'platform', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择平台" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="scratch">Scratch官网</SelectItem>
                                                <SelectItem value="40code">40code</SelectItem>
                                                <SelectItem value="github">GitHub</SelectItem>
                                                <SelectItem value="other">其他</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="输入作品链接"
                                            value={link.url}
                                            onChange={(e) => updateProjectLink(link.id, 'url', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateFormData('defaultLinkId', link.id)}
                                            className={formData.defaultLinkId === link.id ? 'bg-primary text-primary-foreground' : ''}
                                        >
                                            {formData.defaultLinkId === link.id ? '默认' : '设为默认'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeProjectLink(link.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 图片上传 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        图片上传
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 封面图上传 */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">作品封面</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload('coverImage', e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <Label htmlFor="cover-upload" className="cursor-pointer">
                                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.coverImage ? formData.coverImage.name : '点击上传封面图'}
                                    </p>
                                </Label>
                            </div>
                        </div>

                        {/* 头像上传 */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">作者头像</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload('avatarImage', e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.avatarImage ? formData.avatarImage.name : '点击上传头像'}
                                    </p>
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 确认信息 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        确认信息
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="confirm-author"
                                checked={formData.confirmedAuthor}
                                onCheckedChange={(checked) => updateFormData('confirmedAuthor', checked as boolean)}
                            />
                            <Label htmlFor="confirm-author" className="text-sm">
                                我确认我是该作品的作者或获得了作者授权
                            </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="confirm-content"
                                checked={formData.confirmedContent}
                                onCheckedChange={(checked) => updateFormData('confirmedContent', checked as boolean)}
                            />
                            <Label htmlFor="confirm-content" className="text-sm">
                                我确认作品内容健康，符合平台规范
                            </Label>
                        </div>
                    </div>

                    <Separator />

                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !formData.agreedToTerms || !formData.confirmedAuthor || !formData.confirmedContent}
                        className="w-full"
                        size="lg"
                    >
                        {isSubmitting ? '提交中...' : '提交申请'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
