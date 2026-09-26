# 部署与自动发布

## 当前部署

域名为 `sja.remya.top`，服务器为 `remya@134.195.211.13`。

旧域名 `sjaplus.top` 只提供 HTTP 308 永久重定向，保留完整路径、查询参数和请求方法，目标为新域名。Caddy 为两个域名分别管理 HTTPS 证书。旧域名不再独立提供页面或写入数据；未来停止兼容前须另行通知。

| 项目 | 位置 |
| --- | --- |
| Compose 配置 | `/opt/sja/sja-v3/compose.yaml` |
| 数据库密码与审核密钥 | `/opt/sja/sja-v3/.env`，权限 `0600` |
| 当前镜像版本 | `/opt/sja/releases.env` |
| 上次发布前的版本 | `/opt/sja/releases.env.previous` |
| 发布记录 | `/opt/sja/deployments.log` |
| Caddy 站点 | `/etc/caddy/conf.d/sja.caddy` |

前端监听 `127.0.0.1:3030`，Go 监听 `127.0.0.1:3031`。宿主机 Caddy 终止 TLS 并自动续期证书。PostgreSQL 18 仅在 Compose 网络内提供服务，使用全新数据库。其他站点的代理配置保持独立。

## GitHub Actions

两个仓库各自执行 CI。拉取请求只检查与构建；`main` 推送和 `workflow_dispatch` 在检查通过后发布对应服务。

前端执行 lint、类型检查、生产构建和生产依赖审计。后端执行格式检查、`go vet`、竞态测试及真实 PostgreSQL 集成测试。镜像以提交 SHA 命名，在 GitHub runner 构建后，通过 SSH 传送到服务器。服务器不需要 GitHub 仓库访问令牌或镜像仓库令牌。

每个仓库配置以下值：

| 类型 | 名称 | 用途 |
| --- | --- | --- |
| Secret | `DEPLOY_SSH_KEY` | 专用部署私钥 |
| Secret | `DEPLOY_KNOWN_HOSTS` | 固定服务器主机公钥 |
| Variable | `DEPLOY_HOST` | 部署服务器地址 |
| Variable | `DEPLOY_USER` | SSH 用户 |

服务器的专用公钥使用 `restrict,command="/opt/sja/deploy/dispatch.sh"` 限制，只允许 `frontend <SHA>` 或 `backend <SHA>`。安装的 `/usr/local/sbin/sja-deploy` 使用文件锁串行发布，等待容器健康检查；失败时恢复上个镜像版本。数据库迁移在后端启动时执行，使用事务和 PostgreSQL advisory lock。后续迁移应保持向后兼容，镜像回滚不会回退数据库结构。

Compose、Caddy 和服务器部署脚本属于基础设施配置，不随应用镜像自动覆盖。修改这些文件后，管理员应先审阅，再同步到服务器并验证配置。

## 运维

```sh
ssh remya@134.195.211.13
cd /opt/sja/sja-v3
sudo docker compose --env-file .env --env-file /opt/sja/releases.env ps
sudo docker compose --env-file .env --env-file /opt/sja/releases.env logs --tail=100 backend
curl -fsS https://sja.remya.top/api/readyz
```

管理员从服务器 `.env` 获取 `ADMIN_TOKEN`，用于审核页面，不要提交到 Git 或复制到公开日志。API 未配置密钥时关闭审核接口。

手动回滚时，将 `/opt/sja/releases.env` 中对应的镜像改为已保留的提交 SHA，再执行：

```sh
sudo docker compose --env-file .env --env-file /opt/sja/releases.env up -d --no-build --wait
```

## 备份

数据库和图片卷须配套备份。以下命令在服务器执行，生成只允许当前用户读取的文件：

```sh
umask 077
mkdir -p /opt/sja/backups
sudo docker compose exec -T db pg_dump -U sja -d sja -Fc > /opt/sja/backups/sja.dump
sudo docker run --rm -v sja_backend_data:/data:ro alpine:3.23 tar -C /data -czf - . > /opt/sja/backups/media.tar.gz
```

恢复前停止写入，并保留当前数据库与图片卷的备份。`pg_restore` 应先在独立数据库中验证，不能直接覆盖当前实例。
