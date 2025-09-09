'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ImageUploadCrop from './ImageUploadCrop';

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

interface InteractivePreviewProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
}

export default function InteractivePreview({ formData, setFormData }: InteractivePreviewProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [showCoverUpload, setShowCoverUpload] = useState(false);

    const projectNameInputRef = useRef<HTMLInputElement>(null);
    const authorNameInputRef = useRef<HTMLInputElement>(null);
    const projectBriefInputRef = useRef<HTMLInputElement>(null);

    const updateFormData = (field: keyof FormData, value: string | boolean | File | null | ProjectLink[]) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    useEffect(() => {
        if (formData.avatarImage) {
            const url = URL.createObjectURL(formData.avatarImage);
            setAvatarUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setAvatarUrl(null);
        }
    }, [formData.avatarImage]);

    useEffect(() => {
        if (formData.coverImage) {
            const url = URL.createObjectURL(formData.coverImage);
            setCoverUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setCoverUrl(null);
        }
    }, [formData.coverImage]);

    // 处理字段编辑
    const handleFieldEdit = (field: string) => {
        setEditingField(field);
        setTimeout(() => {
            if (field === 'projectName' && projectNameInputRef.current) {
                projectNameInputRef.current.focus();
                projectNameInputRef.current.select();
            } else if (field === 'authorName' && authorNameInputRef.current) {
                authorNameInputRef.current.focus();
                authorNameInputRef.current.select();
            } else if (field === 'projectBrief' && projectBriefInputRef.current) {
                projectBriefInputRef.current.focus();
                projectBriefInputRef.current.select();
            }
        }, 0);
    };

    const handleFieldSave = (field: string, value: string) => {
        updateFormData(field as keyof FormData, value);
        setEditingField(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent, field: string, value: string) => {
        if (e.key === 'Enter') {
            handleFieldSave(field, value);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* 作品卡片预览 */}
            <div className="max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl border-2 border-violet-300 bg-gradient-to-br from-violet-100 to-violet-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex text-ellipsis whitespace-nowrap p-3">
                        {/* 头像区域 - 可点击上传 */}
                        <div className="flex-1 mr-3">
                            <div 
                                className="relative cursor-pointer group"
                                onClick={() => setShowAvatarUpload(true)}
                            >
                                {avatarUrl ? (
                                    <Image 
                                        width={80} 
                                        height={80} 
                                        src={avatarUrl} 
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover group-hover:opacity-80 transition-all duration-300 group-hover:shadow-xl" 
                                        alt={formData.authorName || "头像预览"} 
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 text-xs group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300 shadow-lg group-hover:shadow-xl cursor-pointer">
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">📷</div>
                                            <div>点击上传</div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="material-symbols-outlined text-white text-xs">edit</span>
                                    <span className="text-white text-xs font-medium">编辑</span>
                                </div>
                            </div>
                        </div>

                        {/* 作品信息区域 - 可点击编辑 */}
                        <div className="flex-[3] overflow-hidden">
                            {/* 作品名称 */}
                            <div className="text-lg mb-2">
                                {editingField === 'projectName' ? (
                                    <input
                                        ref={projectNameInputRef}
                                        type="text"
                                        value={formData.projectName}
                                        onChange={(e) => updateFormData('projectName', e.target.value)}
                                        onBlur={(e) => handleFieldSave('projectName', e.target.value)}
                                        onKeyDown={(e) => handleKeyPress(e, 'projectName', e.currentTarget.value)}
                                        className="w-full text-violet-700 bg-transparent border-b-2 border-violet-400 outline-none text-lg font-semibold"
                                        placeholder="作品名称"
                                        maxLength={20}
                                    />
                                ) : (
                                    <h3 
                                        className="text-violet-700 line-clamp-1 cursor-pointer hover:bg-white hover:bg-opacity-50 rounded-lg px-2 py-1 transition-all duration-200 font-semibold hover:shadow-sm"
                                        onClick={() => handleFieldEdit('projectName')}
                                        title="点击编辑作品名称"
                                    >
                                        {formData.projectName || "点击输入作品名称"}
                                    </h3>
                                )}
                            </div>

                            {/* 作者昵称 */}
                            <div className="text-sm">
                                {editingField === 'authorName' ? (
                                    <input
                                        ref={authorNameInputRef}
                                        type="text"
                                        value={formData.authorName}
                                        onChange={(e) => updateFormData('authorName', e.target.value)}
                                        onBlur={(e) => handleFieldSave('authorName', e.target.value)}
                                        onKeyDown={(e) => handleKeyPress(e, 'authorName', e.currentTarget.value)}
                                        className="w-full text-violet-600 bg-transparent border-b-2 border-violet-400 outline-none text-sm"
                                        placeholder="作者昵称"
                                        maxLength={12}
                                    />
                                ) : (
                                    <div 
                                        className="text-violet-600 cursor-pointer hover:bg-white hover:bg-opacity-50 rounded-lg px-2 py-1 transition-all duration-200 hover:shadow-sm"
                                        onClick={() => handleFieldEdit('authorName')}
                                        title="点击编辑作者昵称"
                                    >
                                        {formData.authorName || "点击输入作者昵称"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 封面图片区域 - 可点击上传 */}
                    <div 
                        className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer group overflow-hidden"
                        onClick={() => setShowCoverUpload(true)}
                    >
                        {coverUrl ? (
                            <Image 
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                src={coverUrl} 
                                alt={formData.projectName || "封面预览"} 
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                                <span className="material-symbols-outlined text-4xl mb-2 text-blue-400">image</span>
                                <div className="text-sm font-medium">点击上传封面图片</div>
                                <div className="text-xs text-gray-400 mt-1">推荐 4:3 比例</div>
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-center text-white">
                                <div className="text-lg mb-1">📸</div>
                                <span className="text-sm font-medium">点击编辑封面</span>
                            </div>
                        </div>
                    </div>

                    {/* 作品简介 - 可点击编辑 */}
                    <div className="p-3">
                        {editingField === 'projectBrief' ? (
                            <input
                                ref={projectBriefInputRef}
                                type="text"
                                value={formData.projectBrief}
                                onChange={(e) => updateFormData('projectBrief', e.target.value)}
                                onBlur={(e) => handleFieldSave('projectBrief', e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, 'projectBrief', e.currentTarget.value)}
                                className="w-full text-violet-600 bg-transparent border-b-2 border-violet-400 outline-none text-sm"
                                placeholder="作品简介（可选）"
                                maxLength={20}
                            />
                        ) : (
                            <p 
                                className="text-violet-600 text-sm overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-white hover:bg-opacity-50 rounded-lg px-2 py-1 transition-all duration-200 hover:shadow-sm"
                                onClick={() => handleFieldEdit('projectBrief')}
                                title="点击编辑作品简介"
                            >
                                {formData.projectBrief || "点击输入作品简介（可选）"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 头像上传弹窗 */}
            {showAvatarUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setShowAvatarUpload(false)}>
                    <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform scale-100 animate-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <span className="material-symbols-outlined text-4xl mb-2 text-blue-400">person</span>
                            <h3 className="text-xl font-bold text-gray-800">上传头像</h3>
                            <p className="text-sm text-gray-500 mt-1">选择一张图片并裁剪为正方形头像</p>
                        </div>
                        <ImageUploadCrop 
                            aspectRatio={1}
                            cropSize={{ width: 200, height: 200 }}
                            onImageChange={(file) => {
                                updateFormData('avatarImage', file);
                                setShowAvatarUpload(false);
                            }}
                            currentImage={avatarUrl || undefined}
                            placeholder="选择头像图片"
                            label=""
                        />
                        <div className="flex gap-3 mt-6">
                            <button 
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                onClick={() => setShowAvatarUpload(false)}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 封面上传弹窗 */}
            {showCoverUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setShowCoverUpload(false)}>
                    <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform scale-100 animate-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <span className="material-symbols-outlined text-4xl mb-2 text-blue-400">image</span>
                            <h3 className="text-xl font-bold text-gray-800">上传封面</h3>
                            <p className="text-sm text-gray-500 mt-1">选择一张 4:3 比例的图片作为封面</p>
                        </div>
                        <ImageUploadCrop 
                            aspectRatio={4/3}
                            cropSize={{ width: 800, height: 600 }}
                            onImageChange={(file) => {
                                updateFormData('coverImage', file);
                                setShowCoverUpload(false);
                            }}
                            currentImage={coverUrl || undefined}
                            placeholder="选择封面图片"
                            label=""
                        />
                        <div className="flex gap-3 mt-6">
                            <button 
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                onClick={() => setShowCoverUpload(false)}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 状态提示 */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-100">
                <span className="material-symbols-outlined text-2xl mb-2 text-yellow-400">star</span>
                <div className="text-sm text-gray-600 font-medium">交互式预览</div>
                <div className="text-xs text-gray-500 mt-1">点击头像、封面可以上传图片，点击文字可以直接编辑</div>
            </div>
        </div>
    );
}
