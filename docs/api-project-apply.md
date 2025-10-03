# Project Display Application API

## API info

**API address**: `https://api.sjaplus.top/project-apply`

**Method**: `POST`

**Content-Type**: `multipart/form-data`

---

## Qequest parameters

### Form

| Name | Data type | Required | Description |
|--------|------|------|------|
| `meta` | string (JSON) | Yes | 作品元数据，详见下方 Meta 对象结构 |
| `cover` | File | Yes | 封面图片文件，裁剪为 4:3 比例 |
| `avatar` | File | Yes | 作者头像文件，裁剪为 1:1 比例 |

### Meta 对象结构 (JSON)

```typescript
interface ProjectApplicationMeta {
  project_name: string;        // 作品名称
  author_name: string;         // 作者名称
  author_link: string;         // 作者主页链接 (必填)
  brief: string;               // 作品简介 (必填，≤20字)
  links: ProjectLink[];        // 作品链接列表 (至少1个)
}

interface ProjectLink {
  platform: string;            // 平台类型: scratch | 40code | ccw | aerfaying | github | other
  url: string;                 // 作品链接 URL
  is_default?: boolean;        // 是否为默认链接 (仅一个链接为 true)
}
```

### Meta JSON 示例

```json
{
  "project_name": "几何幸存者",
  "author_name": "几何奶酪",
  "author_link": "https://scratch.mit.edu/users/example/",
  "brief": "这是一个充满未知与危险的几何世界...",
  "links": [
    {
      "platform": "scratch",
      "url": "https://scratch.mit.edu/projects/123456/",
      "is_default": true
    },
    {
      "platform": "40code",
      "url": "https://www.40code.com/project/123456"
    }
  ]
}
```

---

## 请求示例

### JavaScript (FormData)

```javascript
const formData = new FormData();

// 构建 meta 对象
const meta = {
  project_name: "作品名称",
  author_name: "作者名称",
  author_link: "https://scratch.mit.edu/users/author/",
  brief: "作品简介，不超过20字",
  links: [
    {
      platform: "scratch",
      url: "https://scratch.mit.edu/projects/123456/",
      is_default: true
    }
  ]
};

// 添加参数
formData.append('meta', JSON.stringify(meta));
formData.append('cover', coverFile);   // File 对象
formData.append('avatar', avatarFile); // File 对象

// 发送请求
const response = await fetch('https://api.sjaplus.top/project-apply', {
  method: 'POST',
  body: formData
});
```

### cURL

```bash
curl -X POST https://api.sjaplus.top/project-apply \
  -F 'meta={"project_name":"作品名称","author_name":"作者名称","author_link":"https://scratch.mit.edu/users/author/","brief":"作品简介","links":[{"platform":"scratch","url":"https://scratch.mit.edu/projects/123456/","is_default":true}]}' \
  -F 'cover=@/path/to/cover.jpg' \
  -F 'avatar=@/path/to/avatar.jpg'
```

---

## 响应格式

### 成功响应

**HTTP Status**: `200 OK`

**Content-Type**: `application/json`

```json
{
  "status": "ok",
  "message": "申请提交成功，等待审核",
  "data": {
    "application_id": "uuid-string",
    "submitted_at": "2025-10-03T12:34:56Z"
  }
}
```

### 错误响应

**HTTP Status**: `4xx` 或 `5xx`

**Content-Type**: `application/json`

```json
{
  "status": "error",
  "message": "错误描述信息",
  "errors": [
    "具体错误1",
    "具体错误2"
  ]
}
```

