# Homepage Starter

基于 Next.js、React、TypeScript 和 Tailwind CSS 的博客与个人主页模板。

包含 MDX 博客、文章目录、代码高亮、Mermaid、图片放大、主题切换、项目展示、示例简历和书架。所有作者、经历和阅读记录均为演示内容。

## 快速开始

需要 Node.js 20.9 或更高版本。

```bash
npm ci
npm run dev
```

打开 http://localhost:3000 。

## 修改内容

- `lib/site-config.ts`：姓名、域名、头像、导航、社交链接、项目与友情链接。
- `content/profile/resume.ts`：简历数据与版本。
- `app/about/AboutContent.tsx`：关于页示例技能和文案。
- `content/posts/`：博客 MDX 文件。
- `content/reading/`：阅读记录。
- `public/`：头像和文章图片。

文章分类仅支持 `大前端`、`agent`、`学生思维`、`服务端`。`cover: false` 隐藏封面；指定 `cover` 使用对应图片，否则取正文第一张图。正文主章节使用一级标题，子章节使用二级标题。

简历版本中的 `hidden` 只控制简历显示，所有发布内容应视为公开，不要放入需要保密的数据。

## 第三方集成

Umami、Vercel Analytics 和 Giscus 默认关闭。按需复制 `.env.example` 为 `.env.local`，填写自己的配置；详见 [集成说明](docs/integrations.md)。公开变量会进入浏览器，不要填写数据库密码或服务端密钥。

## 检查与部署

```bash
node --test tests/*.test.mjs
npm run lint
npm run build
npm run start
```

可通过支持 Next.js 的平台或 Node 服务器部署。示例域名必须替换成自己的正式地址。本项目尚未配置纯静态导出，不直接承诺 GitHub Pages 可用。

## 分享前

确认演示内容和素材已替换；默认关闭不需要的集成；不要发布 `.env.local`、构建产物、内部计划或本机临时文件。作者应在公开发布前选定并添加开源许可。
