'use client'

import { useState, useEffect } from 'react';
import Board from '../components/ui/Board';
import ApplicationReviewItem from './ApplicationReviewItem';
import Loading from '../components/ui/Loading';

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

export default function ProjectDisplayReviewPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/v2/project-display-review');
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id: string, status: 'approved' | 'rejected', notes: string) => {
        try {
            const response = await fetch('/api/v2/project-display-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    status,
                    notes
                })
            });

            if (response.ok) {
                // 重新获取数据
                fetchApplications();
            } else {
                alert('审核操作失败');
            }
        } catch (error) {
            console.error('Review error:', error);
            alert('审核操作失败');
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    const statusCounts = {
        all: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl text-center mb-8">作品展位申请审核</h1>
                <Loading />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl text-center mb-8">作品展位申请审核</h1>
            
            <Board>
                {/* 过滤器 */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {([
                        ['all', '全部'],
                        ['pending', '待审核'],
                        ['approved', '已通过'],
                        ['rejected', '已拒绝']
                    ] as const).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {label} ({statusCounts[value]})
                        </button>
                    ))}
                </div>

                {/* 申请列表 */}
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        没有找到{filter === 'all' ? '' : 
                            filter === 'pending' ? '待审核的' :
                            filter === 'approved' ? '已通过的' : '已拒绝的'
                        }申请
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredApplications.map((application) => (
                            <ApplicationReviewItem
                                key={application.id}
                                application={application}
                                onReview={handleReview}
                            />
                        ))}
                    </div>
                )}
            </Board>
        </div>
    );
}
