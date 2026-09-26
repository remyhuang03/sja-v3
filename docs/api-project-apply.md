# 作品展位接口

接口已迁至 Go 后端。前端使用同域 `/api/v2/project-display-apply`，不再连接外部旧域名。

提交 multipart 表单，包含 `meta` JSON、`cover` 和 `avatar`。成功返回 HTTP 201；校验失败返回带 `message` 的 JSON。审核接口使用 Bearer 密钥，并通过 PostgreSQL 事务将通过的申请写入展示列表。

完整参数、限制与响应说明见 [后端 API 文档](https://github.com/remyhuang03/sja-backend#api)。
