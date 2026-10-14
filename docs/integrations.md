# 第三方集成

默认访问网站不会加载统计或评论脚本。

## Umami

设置 `NEXT_PUBLIC_ANALYTICS_ENABLED=true`，同时填写 `NEXT_PUBLIC_UMAMI_WEBSITE_ID`、`NEXT_PUBLIC_UMAMI_SCRIPT_URL`、`NEXT_PUBLIC_UMAMI_DOMAINS`。域名使用逗号分隔，不填写协议、路径或端口。配置不完整时保持关闭；浏览器域名不在白名单时不发送事件。

预览部署保持关闭，正式环境启用。网站 ID 是公开配置；只填写自己的 ID 与统计服务。关闭后不得出现 tracker 请求。

## Vercel Analytics

只有 `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true` 才挂载组件。

## Giscus

通过 Giscus 官方配置页面取得自己仓库的 repo、repo ID、category 与 category ID，分别填写 `.env.example` 中对应字段。全部填写并设置 `NEXT_PUBLIC_GISCUS_ENABLED=true` 后才初始化评论。仓库必须按 Giscus 要求启用 Discussions。

## 验证

修改 NEXT_PUBLIC 变量后重新启动开发服务；生产站点需重新构建。在浏览器 Network 中检查默认设置下无 Umami、Vercel Analytics、Giscus 请求。启用后确认请求只指向自己填写的服务。
