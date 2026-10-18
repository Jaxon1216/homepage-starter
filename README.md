<div align="center">

# Homepage Starter

基于 Next.js 16 · React 19 · TypeScript · Tailwind CSS 的个人主页与博客模板

[English](README-en.md) · 简体中文

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-20.9%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

</div>

Homepage Starter 是一个基于 Next.js 16、React 19 和 Tailwind CSS 打造的个人主页与博客模板，内置 MDX 博客、代码高亮、明暗主题、简历页与书架等完整板块。作者信息、文章内容与导航结构都集中在独立的配置文件中，无需改动组件代码即可完成定制。无论你是正在准备求职、持续写作的技术博主，还是想拥有一个长期维护的个人主页，它都旨在提供一个开箱即用、易于定制的写作与发布环境。

## 🖼️ 界面预览

**首页（亮色主题）** —— 粒子网格背景下的首屏全貌：作者信息、身份标签、项目 / 文章 / GitHub 统计卡片与社交链接入口。

<div align="center">
  <img src="docs/imgs/preview-home-light.png" alt="首页（亮色主题）" width="100%">
</div>

**暗色主题与博客文章页** —— 主题一键切换、整站适配；博客页内置 Shiki 代码高亮、Mermaid 流程图与按标题层级自动生成的侧边目录。

| 暗色主题 | 博客文章页 |
| --- | --- |
| ![首页（暗色主题）](docs/imgs/preview-home-dark.png) | ![博客文章页](docs/imgs/preview-blog-mdx.png) |

## ✨ 特性

- **MDX 博客** —— 用 MDX 写文章，支持 GFM 表格、任务列表等扩展语法
- **代码高亮** —— 基于 Shiki 与 rehype-pretty-code，构建时完成高亮
- **Mermaid 流程图** —— 正文写 ```` ```mermaid ```` 代码块即可渲染
- **文章目录** —— 按文章实际标题层级自动生成侧边目录
- **明暗主题** —— next-themes 一键切换，可跟随系统
- **阅读体验** —— 阅读时长统计、图片点击放大
- **简历页** —— TypeScript 数据驱动，一处修改全局生效
- **书架与阅读记录** —— 独立板块展示读书痕迹
- **项目与友链** —— 配置文件统一维护
- **粒子背景与动效** —— particles.js 粒子网格 + framer-motion 页面过渡
- **评论与分析（可选）** —— Giscus、Umami、Vercel Analytics 开关即用，默认关闭

## 🚀 快速开始

需要 Node.js 20.9 或更高版本。

```bash
git clone https://github.com/Jaxon1216/homepage-starter.git
cd homepage-starter
npm ci
npm run dev
```

打开 http://localhost:3000 。

## 🧭 内容自定义

| 文件 | 内容 |
| --- | --- |
| `lib/site-config.ts` | 姓名、域名、头像、导航、社交链接、项目与友情链接 |
| `content/profile/resume.ts` | 简历数据与版本 |
| `app/about/AboutContent.tsx` | 关于页技能与文案 |
| `content/posts/` | 博客 MDX 文章 |
| `content/reading/` | 阅读记录 |
| `public/` | 头像与文章图片 |

写文章时遵循以下约定：

- `tags` 只允许 `大前端`、`agent`、`学生思维`、`服务端` 四个值（`lib/mdx.ts` 会校验，非法值会让 dev / build 直接报错）
- 封面默认取正文第一张图；frontmatter 写 `cover: /images/xxx.png` 可指定，写 `cover: false` 隐藏
- 正文主章节用 `#`，子章节用 `##`，避免跳级

> 简历 `hidden` 只控制展示，所有发布内容应视为公开，不要放入需要保密的数据。

## ☁️ 部署

- 支持任何兼容 Next.js 的平台，或自建 Node 服务器：`npm run build && npm run start`
- 未配置纯静态导出，不直接承诺 GitHub Pages 可用
- 记得把示例域名替换成自己的正式地址

## 🔌 第三方集成

Umami、Vercel Analytics、Giscus 默认关闭。按需复制 `.env.example` 为 `.env.local` 填写配置，详见 [集成说明](docs/integrations.md)。公开变量会进入浏览器，不要填写数据库密码或服务端密钥。

## ✅ 检查

```bash
node --test tests/*.test.mjs
npm run lint
npm run build
npm run start
```

## 📌 发布前

- 确认演示内容和素材已全部替换
- 关闭不需要的集成
- 不要发布 `.env.local` 与构建产物

## License

尚未选定开源许可证，公开发布前请选定并添加（如 MIT）。
