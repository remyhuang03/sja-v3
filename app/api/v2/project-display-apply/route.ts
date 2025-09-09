import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/util/db/connectDB';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface ProjectLink {
    id: string;
    platform: string;
    url: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // 提取表单数据
        const projectName = formData.get('projectName') as string;
        const authorName = formData.get('authorName') as string;
        const projectBrief = formData.get('projectBrief') as string;
        const projectLinksStr = formData.get('projectLinks') as string;
        const defaultLinkId = formData.get('defaultLinkId') as string;
        const personalLink = formData.get('personalLink') as string;
        const coverImage = formData.get('coverImage') as File;
        const avatarImage = formData.get('avatarImage') as File;

        // 解析项目链接
        let projectLinks;
        try {
            projectLinks = JSON.parse(projectLinksStr || '[]');
        } catch {
            return NextResponse.json(
                { error: '项目链接数据格式错误' },
                { status: 400 }
            );
        }

        // 验证必填字段
        if (!projectName || !authorName || !coverImage || !avatarImage) {
            return NextResponse.json(
                { error: '请填写所有必填字段' },
                { status: 400 }
            );
        }

        if (!projectLinks || projectLinks.length === 0) {
            return NextResponse.json(
                { error: '请至少添加一个作品链接' },
                { status: 400 }
            );
        }

        if (!defaultLinkId) {
            return NextResponse.json(
                { error: '请选择默认作品链接' },
                { status: 400 }
            );
        }

        // 验证默认链接ID是否在项目链接中
        const defaultLink = projectLinks.find((link: ProjectLink) => link.id === defaultLinkId);
        if (!defaultLink) {
            return NextResponse.json(
                { error: '默认链接选择无效' },
                { status: 400 }
            );
        }

        // 生成唯一ID
        const applicationId = randomUUID();
        
        // 保存图片文件
        const coverImageBytes = await coverImage.arrayBuffer();
        const avatarImageBytes = await avatarImage.arrayBuffer();
        
        const uploadDir = join(process.cwd(), 'data/var/project-display-applications');
        
        // 确保目录存在
        try {
            await writeFile(join(uploadDir, 'test'), '');
        } catch {
            // 目录不存在，需要创建
            const { mkdir } = await import('fs/promises');
            await mkdir(uploadDir, { recursive: true });
        }
        
        const coverImagePath = join(uploadDir, `${applicationId}_cover.${coverImage.name.split('.').pop()}`);
        const avatarImagePath = join(uploadDir, `${applicationId}_avatar.${avatarImage.name.split('.').pop()}`);
        
        await writeFile(coverImagePath, Buffer.from(coverImageBytes));
        await writeFile(avatarImagePath, Buffer.from(avatarImageBytes));

        // 保存到数据库
        const conn = await connectDB(process.env.DB_SITE_DATABASE);
        if (!conn) {
            return NextResponse.json(
                { error: '数据库连接失败' },
                { status: 500 }
            );
        }

        try {
            await conn.execute(`
                CREATE TABLE IF NOT EXISTS project_display_applications (
                    id VARCHAR(36) PRIMARY KEY,
                    project_name VARCHAR(20) NOT NULL,
                    author_name VARCHAR(12) NOT NULL,
                    project_brief VARCHAR(20),
                    project_links JSON NOT NULL,
                    default_link_id VARCHAR(255) NOT NULL,
                    personal_link TEXT,
                    cover_image_path TEXT NOT NULL,
                    avatar_image_path TEXT NOT NULL,
                    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    reviewed_at TIMESTAMP NULL,
                    reviewer_notes TEXT
                )
            `);

            await conn.execute(`
                INSERT INTO project_display_applications (
                    id, project_name, author_name, project_brief, project_links, 
                    default_link_id, personal_link, cover_image_path, avatar_image_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                applicationId,
                projectName,
                authorName,
                projectBrief,
                JSON.stringify(projectLinks),
                defaultLinkId,
                personalLink || null,
                coverImagePath,
                avatarImagePath
            ]);

            conn.end();

            return NextResponse.json(
                { 
                    success: true, 
                    applicationId,
                    message: '申请提交成功，请等待审核' 
                },
                { status: 200 }
            );

        } catch (dbError) {
            conn.end();
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: '数据库操作失败' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Application submission error:', error);
        return NextResponse.json(
            { error: '提交申请时发生错误' },
            { status: 500 }
        );
    }
}
