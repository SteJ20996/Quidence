# Quidence：GitHub 自动部署到现有 Cloudflare Worker

正式网站目前使用 Cloudflare Worker `shy-thunder-f1c9`，已有 `www.quidence.com` 绑定。连接现有 Worker 与 `SteJ20996/AA01` 后，Cloudflare 会在 `main` 更新时拉取源码、检查、构建和部署。无需为这次连接新建 Worker 或重新绑定域名。

## 仓库配置

- `wrangler.jsonc` 使用现有 Worker 名称，只上传 `static-release/` 中的静态网站。
- `.node-version` 固定 Node.js `24.19.0`，与 `package.json` 和 GitHub Actions 一致。
- 域名及路由继续在 Cloudflare 控制台管理；配置不含 `route` 或 `routes`，并设置 `workers_dev: false`。正式域名和根域名跳转不由这份配置修改。
- `keep_vars: true` 保留现有控制台变量；本次静态发布无需新增应用变量、数据库或后端入口。

这份提交只准备部署配置。合并到 `main` 并在 Cloudflare 完成连接后，自动部署才会生效。

## 连接现有 Worker

1. 先将这份部署配置合并到 `SteJ20996/AA01` 的 `main`。
2. 在 Cloudflare 打开 **Workers & Pages → shy-thunder-f1c9 → Settings → Builds → Connect**。
3. 选择 GitHub 账户 `SteJ20996` 与仓库 `AA01`。如仓库不可见，在 Cloudflare 的 GitHub App 授权中加入 `AA01`；保留 `Qidolab` 的已有授权。
4. 使用以下配置：

| 设置 | 值 |
| --- | --- |
| Worker / Project name | `shy-thunder-f1c9` |
| Git repository | `SteJ20996/AA01` |
| Production branch | `main` |
| Root directory / Advanced Path | `/`，仓库根目录 |
| Build command | `npm test && npm run build:static` |
| Deploy command | `npx wrangler deploy` |
| Preview command（启用预览时） | `npx wrangler preview` |
| 静态文件目录 | 已在 `wrangler.jsonc` 中设置为 `./static-release` |
| Node.js | `.node-version` 已设置为 `24.19.0` |

5. 部署 API token 使用控制台为此 Worker 创建或选择的 token，不要写入 GitHub 文件。若已有 `NODE_VERSION` 构建变量，改为 `24.19.0`，避免覆盖仓库版本文件。
6. 保存连接并启动首次构建。检查日志中 `npm test` 通过、静态包构建成功，最后部署到 `shy-thunder-f1c9`。
7. 打开 `https://www.quidence.com/`，确认雾紫底色、Qidolab logo 与水壶图案、左侧跳转入口，以及英语/西班牙语课程页面。确认 `https://quidence.com/` 仍按原规则跳转到主域名。

Worker 名称必须与配置的 `name` 完全一致。不要把 Project name 改为 `quidence`，否则会指向另一个 Worker。

## 后续更新

修改通过 PR 审核并合并到 `main` 后，Cloudflare 自动发布。Cloudflare 的构建命令独立执行 Node 检查；GitHub Actions 另外执行完整 Chromium 回归。Cloudflare 不会自动等待所有 GitHub Actions 检查，所以应先等 PR 检查通过再合并。

Qidolab 可以直接发布仓库根目录；Quidence 的仓库还含开发、审阅和后端文件，因此始终只发布构建脚本生成的 `static-release/`。不要将 `assets.directory` 改为 `.` 或 `./dist`，也不要将 `npm start` 用作部署命令。

构建脚本要求目标输出目录不存在。Cloudflare 应使用干净 checkout；若重新运行时提示输出目录已存在，先清除该次构建工作区中的生成目录或重新开始干净构建，不要向旧目录追加文件。

## 官方文档

- [Workers Builds：连接现有 Worker 与名称要求](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Builds 构建镜像及 Node 版本覆盖](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [静态文件目录配置](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Wrangler：保留控制台变量及路由管理](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [静态响应的 _headers 支持](https://developers.cloudflare.com/workers/static-assets/headers/)
