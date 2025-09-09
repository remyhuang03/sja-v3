'use client'

import { useState } from 'react';
import Image from 'next/image';

interface ProjectLink {
    id: string;
    platform: string;
    url: string;
}

interface Application {
    id: string;
    project_name: string;
    author_name: string;
    project_brief: string;
    project_links: string; // JSON string
    default_link_id: string;
    personal_link: string;
    cover_image_path: string;
    avatar_image_path: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    reviewed_at: string | null;
    reviewer_notes: string | null;
}

interface ApplicationReviewItemProps {
    application: Application;
    onReview: (id: string, status: 'approved' | 'rejected', notes: string) => void;
}

export default function ApplicationReviewItem({ application, onReview }: ApplicationReviewItemProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 解析项目链接
    const parseProjectLinks = (): ProjectLink[] => {
        try {
            return JSON.parse(application.project_links);
        } catch {
            return [];
        }
    };

    const getDefaultLink = (): ProjectLink | null => {
        const links = parseProjectLinks();
        return links.find(link => link.id === application.default_link_id) || links[0] || null;
    };

    const handleReview = async (status: 'approved' | 'rejected') => {
        if (status === 'rejected' && !reviewNotes.trim()) {
            alert('请填写拒绝原因');
            return;
        }

        setIsSubmitting(true);
        await onReview(application.id, status, reviewNotes);
        setIsSubmitting(false);
        setShowReviewForm(false);
        setReviewNotes('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return '待审核';
            case 'approved': return '已通过';
            case 'rejected': return '已拒绝';
            default: return status;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            {/* 头部信息 */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold">{application.project_name}</h3>
                    <p className="text-gray-600">作者：{application.author_name}</p>
                    <p className="text-sm text-gray-500">申请时间：{formatDate(application.created_at)}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                    </span>
                    {application.reviewed_at && (
                        <p className="text-sm text-gray-500 mt-1">
                            审核时间：{formatDate(application.reviewed_at)}
                        </p>
                    )}
                </div>
            </div>

            {/* 作品信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 预览卡片 */}
                <div>
                    <h4 className="font-medium mb-2">展示效果预览</h4>
                    <div className="max-w-sm">
                        <div className="rounded-md border-2 border-violet-300 bg-violet-200 shadow-md">
                            <div className="flex text-ellipsis whitespace-nowrap">
                                <div className="flex-1 m-2 mr-1 pt-0.5">
                                    <div className="w-16 h-16 rounded-[50%] border-2 border-violet-300 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                        头像
                                    </div>
                                </div>
                                <div className="m-2 ml-1 flex-[3] overflow-hidden">
                                    <div className="text-[15px]">
                                        <h3 className="text-violet-400 line-clamp-1">
                                            {application.project_name}
                                        </h3>
                                    </div>
                                    <div className="text-sm text-ellipsis text-violet-400">
                                        {application.author_name}
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                封面图片
                            </div>

                            <p className="text-violet-400 text-sm p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                {application.project_brief || "作品简介（可选）"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 详细信息 */}
                <div>
                    <h4 className="font-medium mb-2">申请详情</h4>
                    <div className="space-y-2 text-sm">
                        <div><span className="font-medium">作品简介：</span>{application.project_brief || '无'}</div>
                        
                        {/* 显示所有项目链接 */}
                        <div>
                            <span className="font-medium">作品链接：</span>
                            <div className="ml-4 mt-1 space-y-1">
                                {parseProjectLinks().map((link, index) => (
                                    <div key={link.id} className="flex items-center gap-2">
                                        <span className="font-medium text-xs bg-gray-200 px-2 py-1 rounded">
                                            {link.platform}
                                        </span>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                            {link.url}
                                        </a>
                                        {application.default_link_id === link.id && (
                                            <span className="text-green-600 text-xs font-medium">[默认]</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {application.personal_link && (
                            <div><span className="font-medium">个人主页：</span>
                                <a href={application.personal_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {application.personal_link}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 审核备注 */}
            {application.reviewer_notes && (
                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium mb-1">审核备注</h4>
                    <p className="text-sm text-gray-700">{application.reviewer_notes}</p>
                </div>
            )}

            {/* 审核操作 */}
            {application.status === 'pending' && (
                <div className="border-t pt-4">
                    {!showReviewForm ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                开始审核
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">审核备注</label>
                                <textarea
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="请填写审核意见（拒绝时必填）"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReview('approved')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                                >
                                    {isSubmitting ? '处理中...' : '通过'}
                                </button>
                                <button
                                    onClick={() => handleReview('rejected')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                                >
                                    {isSubmitting ? '处理中...' : '拒绝'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReviewForm(false);
                                        setReviewNotes('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
