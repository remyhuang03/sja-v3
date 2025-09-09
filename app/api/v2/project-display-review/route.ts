import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/util/db/connectDB';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const conn = await connectDB(process.env.DB_SITE_DATABASE);
        if (!conn) {
            return NextResponse.json(
                { error: '数据库连接失败' },
                { status: 500 }
            );
        }

        try {
            // 确保表存在
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

            const [rows] = await conn.execute<RowDataPacket[]>(`
                SELECT * FROM project_display_applications 
                ORDER BY created_at DESC
            `);

            conn.end();
            return NextResponse.json(rows, { status: 200 });

        } catch (dbError) {
            conn.end();
            console.error('Database error:', dbError);
            return NextResponse.json([], { status: 200 }); // 返回空数组而不是错误
        }

    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { error: '获取申请列表失败' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { id, status, notes } = await request.json();

        if (!id || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: '参数无效' },
                { status: 400 }
            );
        }

        const conn = await connectDB(process.env.DB_SITE_DATABASE);
        if (!conn) {
            return NextResponse.json(
                { error: '数据库连接失败' },
                { status: 500 }
            );
        }

        // 更新申请状态
        await conn.execute(`
            UPDATE project_display_applications 
            SET status = ?, reviewed_at = NOW(), reviewer_notes = ?
            WHERE id = ?
        `, [status, notes || null, id]);

        // 如果申请被通过，将其添加到正式的展示列表
        if (status === 'approved') {
            // 首先获取申请信息
            const [rows] = await conn.execute<RowDataPacket[]>(`
                SELECT * FROM project_display_applications WHERE id = ?
            `, [id]);

            if (rows.length > 0) {
                const app = rows[0];
                
                // 确保项目展示表存在
                await conn.execute(`
                    CREATE TABLE IF NOT EXISTS project_display (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        project_name VARCHAR(20) NOT NULL,
                        author VARCHAR(12) NOT NULL,
                        brief VARCHAR(20),
                        project_link TEXT NOT NULL,
                        author_link TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                // 解析项目链接并获取默认链接
                let projectLinks;
                let defaultProjectLink = '';
                
                try {
                    projectLinks = JSON.parse(app.project_links);
                    const defaultLink = projectLinks.find((link: { id: string; url: string; }) => link.id === app.default_link_id);
                    defaultProjectLink = defaultLink?.url || projectLinks[0]?.url || '';
                } catch {
                    defaultProjectLink = '';
                }

                // 添加到正式展示列表
                await conn.execute(`
                    INSERT INTO project_display (project_name, author, brief, project_link, author_link)
                    VALUES (?, ?, ?, ?, ?)
                `, [
                    app.project_name,
                    app.author_name,
                    app.project_brief || null,
                    defaultProjectLink,
                    app.personal_link || null
                ]);

                // TODO: 这里应该处理图片文件的移动，从申请目录移动到正式展示目录
                // 现在先简单地记录路径，实际使用时需要实现文件移动逻辑
            }
        }

        conn.end();

        return NextResponse.json(
            { success: true, message: '审核完成' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Review error:', error);
        return NextResponse.json(
            { error: '审核操作失败' },
            { status: 500 }
        );
    }
}
