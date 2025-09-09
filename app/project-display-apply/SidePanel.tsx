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
import { AlertCircle, Plus, Trash2, Upload, FileText, Link, CheckCircle } from "lucide-react";
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

export default function SidePanel({ formData, setFormData }: SidePanelProps) {
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

    const updateProjectLink = (id: string, field: 'platform' | 'url', value: string) => {
        const updatedLinks = formData.projectLinks.map(link =>
            link.id === id ? { ...link, [field]: value } : link
        );
        updateFormData('projectLinks', updatedLinks);
    };

    const removeProjectLink = (id: string) => {
        const updatedLinks = formData.projectLinks.filter(link => link.id !== id);
        updateFormData('projectLinks', updatedLinks);
        
        // 如果删除的是默认链接，清空默认链接选择
        if (formData.defaultLinkId === id) {
            updateFormData('defaultLinkId', '');
        }
    };

    const setDefaultLink = (id: string) => {
        updateFormData('defaultLinkId', id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.agreedToTerms || !formData.confirmedAuthor || !formData.confirmedContent) {
            alert('请确认所有必填项目');
            return;
        }

        if (!formData.projectName || !formData.authorName || !formData.coverImage || !formData.avatarImage) {
            alert('请填写所有必填信息并上传头像和封面图片');
            return;
        }

        if (formData.projectLinks.length === 0) {
            alert('请至少添加一个作品链接');
            return;
        }

        if (!formData.defaultLinkId) {
            alert('请选择一个默认作品链接');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            submitFormData.append('projectName', formData.projectName);
            submitFormData.append('authorName', formData.authorName);
            submitFormData.append('projectBrief', formData.projectBrief);
            submitFormData.append('projectLinks', JSON.stringify(formData.projectLinks));
            submitFormData.append('defaultLinkId', formData.defaultLinkId);
            submitFormData.append('personalLink', formData.personalLink);
            
            if (formData.coverImage) {
                submitFormData.append('coverImage', formData.coverImage);
            }
            if (formData.avatarImage) {
                submitFormData.append('avatarImage', formData.avatarImage);
            }

            const response = await fetch('/api/v2/project-display-apply', {
                method: 'POST',
                body: submitFormData
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
            <Board>
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-amber-600">assignment</span>
                    <h3 className="text-lg font-semibold">申请须知</h3>
                </div>
                <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-sm">
                    <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-sm">star</span>
                            <span>SJA只展示质量较好的作品。</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-sm">block</span>
                            <span>请不要重复申请。</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-sm">edit</span>
                            <span>请准确填写申请表。如填写有误，申请将被否决。</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-sm">analytics</span>
                            <span>作品简介页面必须已经放置 SJA 报告。</span>
                        </li>
                    </ol>
                    
                    <label className="flex items-center mt-6 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border border-amber-200">
                        <input 
                            type="checkbox" 
                            className="mr-3 w-4 h-4 text-amber-600 rounded"
                            checked={formData.agreedToTerms}
                            onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                            required
                        />
                        <span className="text-sm text-gray-700 font-medium">我已阅读并同意申请须知</span>
                        <span className="material-symbols-outlined text-amber-600 ml-auto">check_circle</span>
                    </label>
                </div>
            </Board>

            {/* 作品链接管理 */}
            <Board>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-2xl text-blue-600">link</span>
                        <h3 className="text-lg font-semibold">作品链接</h3>
                    </div>
                    <button
                        type="button"
                        onClick={addProjectLink}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        添加链接
                    </button>
                </div>
                
                {formData.projectLinks.length === 0 && (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-xl">
                        <span className="material-symbols-outlined text-6xl text-blue-400 mb-4">link_off</span>
                        <div className="text-gray-600 font-medium mb-2">还没有添加作品链接</div>
                        <div className="text-sm text-gray-500 mb-4">请至少添加一个作品链接</div>
                        <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                            支持 CCW、A营、GitHub 等平台
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {formData.projectLinks.map((link, index) => (
                        <div key={link.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-2xl text-blue-400">language</span>
                                    <span className="text-white font-semibold">链接 #{index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeProjectLink(link.id)}
                                    className="text-red-400 hover:text-red-300 text-sm bg-red-900 bg-opacity-20 px-3 py-1 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    删除
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-medium">
                                        <span className="material-symbols-outlined text-sm">label</span>
                                        平台名称
                                    </label>
                                    <select
                                        value={link.platform}
                                        onChange={(e) => updateProjectLink(link.id, 'platform', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-medium bg-white shadow-sm"
                                        required
                                    >
                                        <option value="">请选择平台</option>
                                        <option value="CCW">CCW</option>
                                        <option value="A营">A营</option>
                                        <option value="别针社区">ClipCC（别针社区）</option>
                                        <option value="GitHub">GitHub</option>
                                        <option value="其他">其他</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-medium">
                                        <span className="material-symbols-outlined text-sm">link</span>
                                        作品链接
                                    </label>
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateProjectLink(link.id, 'url', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-medium bg-white shadow-sm"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                        <input
                                            type="radio"
                                            name="defaultLink"
                                            checked={formData.defaultLinkId === link.id}
                                            onChange={() => setDefaultLink(link.id)}
                                            className="mr-3 w-4 h-4 text-blue-600"
                                        />
                                        <span className="material-symbols-outlined text-yellow-400 mr-2">star</span>
                                        <span className="text-sm text-gray-300 font-medium">设为默认链接</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Board>

            {/* 个人链接 */}
            <Board>
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">👤</div>
                    <h3 className="text-lg font-semibold">个人信息</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                            <span className="text-blue-600">🌐</span>
                            <span>个人主页链接（可选）</span>
                        </label>
                        <input 
                            type="url" 
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium bg-white shadow-sm transition-all duration-200"
                            placeholder="https://your-homepage.com"
                            value={formData.personalLink}
                            onChange={(e) => updateFormData('personalLink', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span>💡</span>
                            <span>填写您的个人主页、社交媒体等链接</span>
                        </p>
                    </div>
                </div>
            </Board>

            {/* 确认事项 */}
            <Board>
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">✅</div>
                    <h3 className="text-lg font-semibold">确认事项</h3>
                </div>
                <div className="space-y-4">
                    <label className="flex items-start cursor-pointer p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200">
                        <input 
                            type="checkbox" 
                            className="mr-3 mt-1 w-4 h-4 text-green-600 rounded"
                            checked={formData.confirmedContent}
                            onChange={(e) => updateFormData('confirmedContent', e.target.checked)}
                            required
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="text-green-600">🛡️</span>
                                <span>内容健康承诺</span>
                            </span>
                            <p className="text-xs text-gray-600 mt-1">我承诺作品内容健康向上，符合法律法规和道德规范。</p>
                        </div>
                    </label>

                    <label className="flex items-start cursor-pointer p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                        <input 
                            type="checkbox" 
                            className="mr-3 mt-1 w-4 h-4 text-blue-600 rounded"
                            checked={formData.confirmedAuthor}
                            onChange={(e) => updateFormData('confirmedAuthor', e.target.checked)}
                            required
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="text-blue-600">📝</span>
                                <span>原创授权声明</span>
                            </span>
                            <p className="text-xs text-gray-600 mt-1">我是作品原作者，授权 SJA Plus 网站（sjaplus.top）在站点内对本作品进行信息网络传播（在展示位展示）</p>
                        </div>
                    </label>
                </div>
            </Board>

            {/* 提交按钮 */}
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
            >
                <div className="flex items-center justify-center gap-3">
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>提交中...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-xl">send</span>
                            <span>提交申请</span>
                        </>
                    )}
                </div>
            </button>

            {/* 状态指示 */}
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                    <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        formData.agreedToTerms && formData.confirmedAuthor && formData.confirmedContent 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {formData.agreedToTerms && formData.confirmedAuthor && formData.confirmedContent ? 'check_circle' : 'warning'}
                        </span>
                        <span>
                            {formData.agreedToTerms && formData.confirmedAuthor && formData.confirmedContent 
                                ? '确认项已完成' 
                                : '请完成确认项'}
                        </span>
                    </div>
                    
                    <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        formData.projectLinks.length > 0 && formData.defaultLinkId
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {formData.projectLinks.length > 0 && formData.defaultLinkId ? 'check_circle' : 'cancel'}
                        </span>
                        <span>
                            {formData.projectLinks.length > 0 && formData.defaultLinkId
                                ? '链接已配置' 
                                : '请添加作品链接'}
                        </span>
                    </div>

                    <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        formData.projectName && formData.authorName && formData.coverImage && formData.avatarImage
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {formData.projectName && formData.authorName && formData.coverImage && formData.avatarImage ? 'check_circle' : 'cancel'}
                        </span>
                        <span>
                            {formData.projectName && formData.authorName && formData.coverImage && formData.avatarImage
                                ? '基本信息已完成' 
                                : '请完成基本信息和图片上传'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
