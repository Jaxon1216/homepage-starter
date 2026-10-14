# Repository AGENTS

## 默认协作约定

- 默认使用中文沟通。
- 除非用户明确要求，不要创建 commit、不要 push。

## Commit 约定

- 提交信息风格遵循本仓库既有历史，优先使用：`feat:`、`fix:`、`chore:`、`docs:`。
- 标题保持简洁，一行概括本次改动的主要目的，避免写成长段描述。
- 优先描述“为什么改”或“这次改动的核心结果”，不要堆砌实现细节。

### 参考格式

- `feat: add xxx`
- `fix: resolve xxx issue`
- `chore: refresh xxx`
- `docs: add xxx post`

## 提交前检查

- 先看 `git status`，确认只提交本次相关文件。
- 先看 `git diff --staged --stat` / `git diff`，确认提交内容和范围准确。
- 提交信息尽量和最近 commit 风格保持一致。
- 如果本次改动涉及文章或文档内容，提交前检查标题层级是否与仓库内同类文件保持一致，并且层级递进合理。
- 博客文章默认以文章页标题作为页面主标题，正文内主章节优先使用 `#`，子章节使用 `##`，避免无意义跳级（例如从 `#` 直接跳到 `###`）。
- 如果新增了文章目录、锚点或基于标题的交互，提交前确认目录能正确识别当前文章实际使用的标题层级。
- 如果目录设计目标是展示正文前两级标题，则提交前确认目录只包含“当前文章实际最高级标题 + 下一层标题”；若文章标题层级不适合目录展示，先调整正文标题层级，再提交代码。

## 博客 tags 准出

文章 frontmatter 的 `tags` **只允许**下面四个值，一篇文章通常只打一个：

- `大前端`：浏览器、React、工程化等前端技术文
- `agent`：AI 编程、Agent、工具流
- `学生思维`：校园、学习方法、非技术随笔
- `服务端`：后端、基础设施、接口与数据

不要自造近义词（如 `前端`、`React`、`AI`、`工具`、`学校`）。`lib/mdx.ts` 会在读取文章时校验；非法 tag 会让 dev / build 直接报错，而不是被静默过滤。

博客列表右侧封面默认取正文第一张图。也可在 frontmatter 写 `cover: /images/xxx.png` 指定，或 `cover: false` 不展示。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
