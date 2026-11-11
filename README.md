# 鲸柜柜家居 · 公司官网

成都鲸柜柜家居有限公司的静态官网。纯 HTML / CSS / JavaScript，无前端框架、无运行时依赖，构建只需要 Node.js。

- 定位：成都 · 全屋定制（衣柜 / 橱柜 / 客厅柜体 / 书房与多功能房）
- 结构：首页 + 4 个产品详情 + 8 个案例详情 + 4 个板材详情 + 厂区页 + 隐私说明 + 404 + 表单提交成功页
- 内容：`content/*.json`，可用 Pages CMS 在浏览器里改字、换图
- 部署：Cloudflare Pages（Git 推送自动构建），也可放到任意静态托管
- 表单：FormSubmit（配置接收邮箱后启用，不需要自建后台）

## 本地预览

需要 Node.js 18 或更高版本（本项目在 Node 26 上构建通过）。

```bash
npm run dev
```

打开 `http://localhost:4173`。`npm run dev` 会先构建再启动本地静态服务器。

如果想让同一 Wi-Fi 下的手机预览，启动后终端会打印本机局域网地址（形如 `http://192.168.0.119:4173`），手机直接访问即可。打不开时，在 Windows 防火墙里允许 Node.js 访问“专用网络”。

只想重新构建：

```bash
npm run build
```

构建产物在 `dist/`。构建会检查：

- 8 个案例、4 个产品系列、4 种板材的必填字段与 slug；
- 案例分类是否在 `projectsSection.filters` 中；
- 所有图片路径是否存在；
- 正式域名、接收邮箱、ICP 是否已填写（未填写时给出警告，不阻断构建）。

## 目录

```text
content/
  site.json              全站文案、SEO、4 个产品系列、流程、联系信息
  privacy.json           隐私说明
  materials.json         4 种板材（颗粒板 / 多层板 / 欧松板 / 橡胶木板）
  factory.json           新都龙桥「柜柜大家居」厂区介绍
  projects/*.json        8 个空间案例
public/
  images/                网站图片、企业 logo、板材纹理、社交分享图（Pages CMS 上传也到这里）
  favicon-32.png         浏览器标签图标
  favicon-192.png
  apple-touch-icon.png   手机添加到桌面图标
  _headers              Cloudflare Pages 响应头 / CSP
  _redirects            Cloudflare Pages 重定向
src/
  template.mjs           HTML 模板（首页与全部详情页）
  styles.css             全站样式
  main.js                导航、筛选、板材弹层、手风琴、表单
scripts/
  build.mjs              零依赖构建脚本
  dev.mjs                本地静态服务器
.pages.yml               Pages CMS 配置
docs/
  上线与域名指南.md       从注册域名到正式上线的完整步骤
  图片与内容管理.md       换图、加案例、改板材/厂区、改文案
```

## 上线前必须处理的 4 件事

1. **接收邮箱**：把 `content/site.json` 里的 `contact.formEmail` 改成真实邮箱，重新构建并部署；第一次提交后到邮箱点 FormSubmit 激活链接。未填写时表单会明确提示“尚未接通”，不会假装提交成功。
2. **正式域名**：`seo.siteUrl` 当前为 `https://jingguigui.cn`；换域名时同步修改，否则 canonical、OG、sitemap 仍指向旧地址。
3. **真实图片**：`public/images/` 目前是 Unsplash 设计意向图。换成公司真实项目照片，并同步修改对应 JSON 的 `alt`；换完后把 `projectsSection.note` 里的“图片为设计意向示意”改掉或清空。
4. **ICP 备案号**：如果用中国大陆服务器 / CDN，必须完成 ICP 备案，并把备案号填到 `footer.icp`；用 Cloudflare Pages 等海外托管可留空。

## 部署（最短路径）

只想先上线、暂时不用 GitHub：在 Cloudflare Pages 里选 **Upload assets**，把 `dist/` 整个拖进去即可，详见指南 3.1。长期维护推荐下面的 Git 自动部署。

1. 把本目录推到一个 GitHub 仓库（私有仓库也可以）。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git，选择仓库。
3. 构建命令 `npm run build`，输出目录 `dist`，生产分支 `main`。
4. 部署完成后先访问 `https://<项目名>.pages.dev` 验收。
5. 在 Pages 项目里绑定自定义域名，按提示把域名 NS 切到 Cloudflare，或添加 CNAME。
6. 按 `docs/上线与域名指南.md` 配置 FormSubmit、Pages CMS、搜索引擎收录。

## 当前状态

- 已上线：<https://jingguigui.cn>（Cloudflare Pages 项目 `jingguigui`，生产分支 `main`）。
- 已完成：首页、4 个产品详情、8 个案例详情、4 个板材详情、厂区页、隐私页、404、感谢页、sitemap、robots、Cloudflare 头/重定向、Pages CMS 配置。
- 已实现：页眉/logo 放大、产品/案例卡直达详情页、案例分类/地址/相近案例、板材桌面弹层 + 手机子页、厂区介绍。
- 交互自检：首页筛选、案例跳转、板材弹层开关与焦点、移动菜单、表单校验、横向溢出均通过。
- 域名：`jingguigui.cn` 的 Apex 已生效；`www` 的 Cloudflare 证书仍在签发，生效前请使用 Apex 地址。
- 仍需补充：接收预约邮箱（`contact.formEmail`）、真实项目照片与板材实拍图、GitHub 仓库与 Pages CMS 登录。
- 图片来源：Unsplash 免费图 + 程序生成的板材纹理，仅作设计意向示意，不在页面中声称是公司实景。

## 内容修改的两种方式

- **推荐：Pages CMS**。在 <https://app.pagescms.org> 用 GitHub 登录，选择仓库，按 `.pages.yml` 的可视化表单改字、上传图片；保存后自动提交，Cloudflare 会自动重新部署。
- **直接改 JSON**：改动 `content/site.json`、`content/materials.json`、`content/factory.json` 或 `content/projects/*.json` 后运行 `npm run build`。注意保持合法 JSON；图片必须先放进 `public/images/`，再在 JSON 里写 `/images/文件名`。

更细的步骤见：

- [上线与域名指南](docs/上线与域名指南.md)
- [图片与内容管理](docs/图片与内容管理.md)
