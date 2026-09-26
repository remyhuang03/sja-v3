# SJA Plus 前端

## 运行

线上地址：https://sja.remya.top。

本仓库只负责 Next.js 页面、shadcn/ui 组件和静态内容。作品分析、相似度对比、报告生成、申请审核与 PostgreSQL 数据访问均由相邻的 `sja-backend` 仓库负责。

将两个仓库放在同一目录下，在本仓库执行：

```sh
cp .env.example .env
# 将两次 openssl rand -hex 32 的结果分别填入 POSTGRES_PASSWORD 和 ADMIN_TOKEN。
docker compose up -d --build --wait
```

访问 `http://localhost:3030`。前端和 API 只绑定回环地址，数据库不开放主机端口。数据库与上传图片分别保存在 `postgres_data`、`backend_data` 卷中。不要在保留数据的部署上执行 `docker compose down -v`。

## 开发与检查

运行环境为 Node.js 24 LTS、Next.js 16、React 19、Tailwind CSS 4。依赖锁定在 `package-lock.json`。TypeScript 6 和 ESLint 9 是当前 Next.js 检查插件支持的版本，因此没有强行升级到不兼容的大版本。

```sh
npm ci
API_INTERNAL_URL=http://127.0.0.1:3031 npm run dev
npm run lint
npm run typecheck
npm run build
```

`API_INTERNAL_URL` 在 Next.js 启动开发服务器或构建时读取。生产镜像默认指向 Compose 内的 `backend:8080`；公网部署由 Caddy 将 `/api/*` 直接转发给 Go，其余请求交给 Next.js。

## 功能

- 分析 SB3、CC3 和 JSON，生成 SVG 报告，支持分类与排序。
- 双文件对比展示积木类型和连接关系的相似度。算法不检测素材或代码语义，分数不能独立证明抄袭。
- 展位申请上传图片、添加作品链接；管理员使用审核密钥访问 `/project-display-review`。
- 新闻、导航和更新日志是前端仓库内的静态编辑内容。

上传原作品只用于当前请求，处理完后清理临时文件。报告保留 30 天。展位申请及图片保存供审核，审核通过后进入展示列表。审核密钥仅保存在页面内存中，刷新页面后需要重新输入。

部署、备份和自动发布见 [部署文档](deploy/README.md)，API 约定见 [后端仓库](https://github.com/remyhuang03/sja-backend)。
