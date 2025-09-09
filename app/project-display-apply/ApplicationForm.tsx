'use client'

import { useState } from "react";
import Board from "../components/ui/Board";
import ImageUploadCrop from "./ImageUploadCrop";

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

interface ApplicationFormProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
}

export default function ApplicationForm({ formData, setFormData }: ApplicationFormProps) {
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
            alert('请填写所有必填信息');
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
        <Board>
            <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <div>
                    <h2 className="text-lg mb-4 text-white">📝 申请信息</h2>
                    
                    {/* 申请须知 */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-bold mb-2">*申请须知</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>SJA只展示质量较好的作品。</li>
                            <li>请不要重复申请。</li>
                            <li>请准确填写申请表。如填写有误，申请将被否决。</li>
                            <li>作品简介页面必须已经放置 SJA 报告。</li>
                        </ol>
                        
                        <label className="flex items-center mt-4 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={formData.agreedToTerms}
                                onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                                required
                            />
                            <span className="text-sm">我已阅读申请须知</span>
                        </label>
                    </div>

                    {/* 基本信息 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">*基本信息</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">
                                作品名称（20字以内） *
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入"
                                maxLength={20}
                                value={formData.projectName}
                                onChange={(e) => updateFormData('projectName', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">
                                作者昵称（12字以内） *
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入"
                                maxLength={12}
                                value={formData.authorName}
                                onChange={(e) => updateFormData('authorName', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">
                                作品展示简介（概括作品内容，可不填，20字以内）
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入"
                                maxLength={20}
                                value={formData.projectBrief}
                                onChange={(e) => updateFormData('projectBrief', e.target.value)}
                            />
                        </div>

                        {/* 作品链接管理 */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-medium text-white">
                                    作品链接 *（至少添加一个平台）
                                </label>
                                <button
                                    type="button"
                                    onClick={addProjectLink}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                    + 添加链接
                                </button>
                            </div>
                            
                            {formData.projectLinks.length === 0 && (
                                <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                                    请至少添加一个作品链接
                                </div>
                            )}

                            {formData.projectLinks.map((link, index) => (
                                <div key={link.id} className="bg-gray-700 p-4 rounded-lg mb-3 border border-gray-600">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-white font-medium">链接 #{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeProjectLink(link.id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            删除
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">平台名称</label>
                                            <select
                                                value={link.platform}
                                                onChange={(e) => updateProjectLink(link.id, 'platform', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">选择平台</option>
                                                <option value="CCW">CCW</option>
                                                <option value="A营">A营</option>
                                                <option value="别针社区">ClipCC（别针社区）</option>
                                                <option value="GitHub">GitHub</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1">作品链接</label>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateProjectLink(link.id, 'url', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="defaultLink"
                                                checked={formData.defaultLinkId === link.id}
                                                onChange={() => setDefaultLink(link.id)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-300">设为默认链接</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">
                                个人主页链接（可选）
                            </label>
                            <input 
                                type="url" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入"
                                value={formData.personalLink}
                                onChange={(e) => updateFormData('personalLink', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 图片上传 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                *作品封面图（图片比例为传统编辑器的4:3，png/jpg 格式）
                            </label>
                            <ImageUploadCrop 
                                aspectRatio={4/3}
                                maxSize={5 * 1024 * 1024} // 5MB
                                onImageChange={(file) => updateFormData('coverImage', file)}
                                currentImage={formData.coverImage}
                                placeholder="点击上传封面图片"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                *头像图片（图片比例为1:1，png/jpg 格式）
                            </label>
                            <ImageUploadCrop 
                                aspectRatio={1}
                                maxSize={1 * 1024 * 1024} // 1MB
                                onImageChange={(file) => updateFormData('avatarImage', file)}
                                currentImage={formData.avatarImage}
                                placeholder="点击上传头像图片"
                            />
                        </div>
                    </div>

                    {/* 确认事项 */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-white">*请确认以下事项：</h3>
                        
                        <label className="flex items-start cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="mr-2 mt-1"
                                checked={formData.confirmedContent}
                                onChange={(e) => updateFormData('confirmedContent', e.target.checked)}
                                required
                            />
                            <span className="text-sm text-white">我承诺作品内容健康向上，符合法律法规和道德规范。</span>
                        </label>

                        <label className="flex items-start cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="mr-2 mt-1"
                                checked={formData.confirmedAuthor}
                                onChange={(e) => updateFormData('confirmedAuthor', e.target.checked)}
                                required
                            />
                            <span className="text-sm text-white">我是作者本人，授权 SJA Plus 网站（sjaplus.top）在站点内对本作品进行信息网络传播（在展示位展示）</span>
                        </label>
                    </div>

                    {/* 提交按钮 */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {isSubmitting ? '提交中...' : '提交申请'}
                    </button>
                </div>
            </form>
        </Board>
    );
}
