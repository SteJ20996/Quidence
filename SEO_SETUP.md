# Quidence 基础 SEO 配置

本轮以 `https://www.quidence.com` 为正式主站，保留现有课程路径、语言选择和本地学生记录。没有替你部署、提交 Google 索引或修改 Cloudflare DNS。

## 已完成的代码配置

- `robots.txt` 允许抓取公开页面及其 CSS/JS，列出 sitemap，禁止抓取 `/api/`。报告工作区保持可抓取，让搜索引擎看到 `noindex`。
- `sitemap.xml` 列出主页、11 门课程、数据使用说明的英文和西语版本，共 26 个规范网址。不收录账户、个人记录、报告工作区、内部模块工具页、历史物理入口或未发布预览。
- 语言版本沿用 `?lang=en` 和 `?lang=es`。这两个网址可直接选择语言，不依赖上次的语言偏好。`hreflang` 的 `en`、`es`、`es-MX` 互相对应；两个西语标记指向同一份拉美西语内容。
- 规范网址保留活动的 `module` 参数及语言，去除版本号、追踪参数和 hash。不会把所有学科的测试页归到同一个无课程参数的网址。
- 标题、描述和分享信息区分课程及语言。账户、记录和报告页在原始 HTML 中即含 `noindex`，静态部署包也包含相应 `X-Robots-Tag` 规则。
- 不增加第三方追踪脚本，不读取学生答案，不修改 localStorage，也不自动跳转到另一域名。

## 当前阶段的限制

现有静态托管通过 JavaScript 翻译同一份 HTML，因此 canonical 与 hreflang 在渲染后生成，原始 HTML 不硬编码一个随后被西语覆盖的英文 canonical。Google 支持 JavaScript 生成这些信息，但实际效果须在 Search Console 的 URL Inspection 中检查“渲染后的 HTML”。未来可在课程介绍完成后生成独立英文／西语静态页面，让信息直接出现在初始响应里；本轮不迁移网址或学生记录。

Google 可以选择不同的 canonical；canonical 和 sitemap 都不保证收录或排名。`noindex` 不是隐私访问控制。当前学生答案只存在各自浏览器中，本轮也不会把它们发布到任何公开网址。

## 本地维护与部署

修改 SEO 配置或重新生成主页／课程页后，按顺序运行：

```bash
npm run build:seo
npm run version:activities
npm run build:seo
npm run test:seo
npm test
npm run build:static
```

第二次 `build:seo` 是幂等整理检查；构建脚本会拒绝遗漏或过期的 SEO 文件。`static-release/` 必须是新的空输出位置，只将其中的文件部署到现有 Cloudflare Worker。ZIP 根目录应直接包含 `index.html`、`robots.txt`、`sitemap.xml`、`assets/` 等。

`_headers` 的效果取决于托管配置，应上线后检查实际响应；报告页另有 HTML `noindex`，不完全依赖响应头。

## Google Search Console：需要你完成的账号步骤

1. 打开 https://search.google.com/search-console ，使用你自己的 Google 账号。
2. Add property 选择 **Domain**，填 `quidence.com`，不填协议或 `www`。若已有这个 Domain property，直接使用它。
3. 复制 Google 实际给出的 TXT 值，不使用示例或占位验证码。
4. 在 Cloudflare 中打开 `quidence.com` → DNS → Records → Add record。Type 选 `TXT`，Name 填 `@`，Content 粘贴完整的 `google-site-verification=...`，TTL 使用 Auto。保留所有原有 DNS、邮件和网站记录。
5. 返回 Search Console 点击 Verify，成功后保留这个 TXT 记录。
6. 部署本轮网站包并确认主站恢复正常开放后，在 Sitemaps 提交 `https://www.quidence.com/sitemap.xml`。只提交正式公开内容，暂时关闭的课程先从配置中移除或延后提交。
7. 用 URL Inspection 检查主页、微积分和数论的英／西语网址，例如 `https://www.quidence.com/courses/number-theory/?lang=es`。运行 Test live URL，检查页面可访问、渲染后正文是西语、canonical 指向同一西语网址，且正常课程没有 `noindex`。
8. 对照检查 `/reports/` 应当不参与收录。公开课程确认正常后才请求索引。

主域名的 Cloudflare 跳转继续使用现有规则，另行确认裸域名跳向 `www.quidence.com` 时保留原路径和 query。不要把 `.org` 或 `.app` 加上永久跳转，本轮没有改变它们的用途。

## 后续观察

记录正式部署日期。每隔几周查看 Page indexing、Performance 中的展示、点击和搜索词，分别查看英文／西语网址。早期展示少不能直接说明配置失效；先确认抓取、渲染和收录状态，再改善课程介绍与原创讲解。

## 官方依据

- [Google：canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google：JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google：双语版本与 hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google：noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Search Console：域名验证](https://support.google.com/webmasters/answer/9008080)
