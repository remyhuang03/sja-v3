'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

interface PreviewCardProps {
    formData: FormData;
}

export default function PreviewCard({ formData }: PreviewCardProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

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

    const getProjectLink = () => {
        if (formData.defaultLinkId) {
            const defaultLink = formData.projectLinks.find(link => link.id === formData.defaultLinkId);
            return defaultLink?.url || '#';
        }
        return formData.projectLinks[0]?.url || '#';
    };

    const getDefaultLinkPlatform = () => {
        if (formData.defaultLinkId) {
            const defaultLink = formData.projectLinks.find(link => link.id === formData.defaultLinkId);
            return defaultLink?.platform || '未知平台';
        }
        return formData.projectLinks[0]?.platform || '未知平台';
    };

    const getAuthorLink = () => {
        return formData.personalLink || '#';
    };

    return (
        <div className="max-w-sm mx-auto">
            <div className="rounded-md border-2 border-violet-300 bg-violet-200 shadow-md">
                <div className="flex text-ellipsis whitespace-nowrap">
                    <div className="flex-1 m-2 mr-1 pt-0.5">
                        {avatarUrl ? (
                            <Image 
                                width={64} 
                                height={64} 
                                src={avatarUrl} 
                                className="w-16 h-16 rounded-[50%] border-2 border-violet-300 object-cover" 
                                alt={formData.authorName || "头像预览"} 
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-[50%] border-2 border-violet-300 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                头像
                            </div>
                        )}
                    </div>
                    <div className="m-2 ml-1 flex-[3] overflow-hidden">
                        <div className="text-[15px]">
                            <h3 className="text-violet-400 line-clamp-1">
                                {formData.projectName || "作品名称"}
                            </h3>
                        </div>
                        <div className="text-sm text-ellipsis text-violet-400">
                            {formData.authorName || "作者昵称"}
                        </div>
                    </div>
                </div>

                <div className="relative aspect-[4/3] bg-gray-200">
                    {coverUrl ? (
                        <Image 
                            fill
                            className="object-cover" 
                            src={coverUrl} 
                            alt={formData.projectName || "封面预览"} 
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                            封面图片
                        </div>
                    )}
                </div>

                <p className="text-violet-400 text-sm p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.projectBrief || "作品简介（可选）"}
                </p>
            </div>

            {/* 链接信息 */}
            <div className="mt-4 text-xs text-gray-600 space-y-1">
                <div>默认作品链接: {getProjectLink()} ({getDefaultLinkPlatform()})</div>
                <div>作者链接: {getAuthorLink()}</div>
                {formData.projectLinks.length > 0 && (
                    <div>
                        <div className="font-medium mt-2 mb-1">所有作品链接:</div>
                        {formData.projectLinks.map((link, index) => (
                            <div key={link.id} className="flex items-center gap-2">
                                <span>{index + 1}. {link.platform}: {link.url}</span>
                                {formData.defaultLinkId === link.id && (
                                    <span className="text-green-600 text-xs">[默认]</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 状态指示 */}
            <div className="mt-4 text-xs space-y-1">
                <div className={`inline-block px-2 py-1 rounded ${
                    formData.agreedToTerms && formData.confirmedAuthor && formData.confirmedContent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {formData.agreedToTerms && formData.confirmedAuthor && formData.confirmedContent 
                        ? '✓ 确认项已完成' 
                        : '⚠ 请完成确认项'}
                </div>
                
                <div className={`inline-block px-2 py-1 rounded ml-2 ${
                    formData.projectLinks.length > 0 && formData.defaultLinkId
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {formData.projectLinks.length > 0 && formData.defaultLinkId
                        ? '✓ 链接已配置' 
                        : '⚠ 请添加作品链接'}
                </div>
            </div>
        </div>
    );
}
