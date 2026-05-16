# DecimalTools — 在线小数与测量工具站

<div align="center">

![DecimalTools 站点](/public/static/images/geekskai-blog.png)

[![GitHub stars](https://img.shields.io/github/stars/geekskai/decimaltools?style=social&label=Stars)](https://github.com/geekskai/decimaltools)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekskai/decimaltools)

[在线站点](https://decimaltools.com/) · [English README](https://github.com/geekskai/decimaltools/blob/main/README.md)

**本项目由开源博客模板 [geekskai/blog](https://github.com/geekskai/blog) 演进、改造而来，现专注于小数工具、单位换算与配套内容。**

</div>

---

## 项目说明

**DecimalTools**（[decimaltools.com](https://decimaltools.com/)）是一个基于 **Next.js** 的站点，提供 **免费、偏前端完成** 的小数与测量相关工具（如分数英寸转小数），并保留 **MDX 博客/教程** 能力，便于做 SEO 与长尾说明文。

- **上游来源**：代码与架构最初来自 **[geekskai/blog](https://github.com/geekskai/blog)**（Next.js App Router、Contentlayer2、Tailwind、MDX 内容管线等）。
- **当前方向**：从「通用博客模板」调整为 **DecimalTools 产品** — 工具页、文案与站点信息围绕小数/测量场景，而非泛博客主题。

若原博客模板对你有帮助，也欢迎给 **[geekskai/blog](https://github.com/geekskai/blog)** 点个 Star。

## 主要特性

- **工具**：交互式计算器与换算器（示例：[英寸转小数](https://decimaltools.com/tools/convert-inches-to-decimal/)）。
- **内容**：`data/blog` 下的 **MDX** 文章（支持 KaTeX、front matter、FAQ 等）。
- **国际化**：`app/[locale]` + [next-intl](https://next-intl-docs.vercel.app/) 多语言路由。
- **性能与 SEO**：Next.js 14、静态生成策略以仓库配置为准；含站点地图、IndexNow 等脚本。

## 技术栈

| 领域 | 技术 |
|------|------|
| 框架 | **Next.js 14**（App Router）、**React 18**、**TypeScript** |
| 内容 | **contentlayer2**、**MDX** |
| 样式 | **Tailwind CSS 3** |
| 国际化 | **next-intl** |
| 可选集成 | **Pliny**（分析、评论等，按需开启） |

## 快速开始

```bash
git clone https://github.com/geekskai/decimaltools.git
cd decimaltools
yarn
yarn dev
```

**Windows（PowerShell）** 若需要：

```powershell
$env:PWD = (Get-Location).Path
yarn dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)（端口以终端输出为准）。

## 目录结构（摘要）

- `app/[locale]/` — 页面、布局与工具路由。
- `data/blog/` — MDX 文章与元数据。
- `contentlayer.config.ts` — 内容模型与 MDX 处理。
- `messages/` — `next-intl` 文案。
- `scripts/` — 构建与 IndexNow 等脚本。

## 部署

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekskai/decimaltools)

在 Vercel 项目设置中配置所需环境变量（统计、Giscus、各类可选 API）。以仓库内 `.env.example` 为准（若有），只填你实际启用的项。

### 其他托管

部分环境可使用：

```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
```

具体请结合 `next.config.js` 与托管方文档。

## 参与贡献

欢迎提交 Issue 与 PR：缺陷修复、文档、无障碍与符合站点定位的新工具。

## 开源协议

[MIT](https://github.com/geekskai/decimaltools/blob/main/LICENSE) © [geeks kai](https://decimaltools.com)

### 上游与致谢

- **博客基底**：[geekskai/blog](https://github.com/geekskai/blog)。
- **第三方**：个别工具可能基于其他 MIT 项目改编，详见各工具目录下的 `ATTRIBUTION.md` 或许可说明。

---

<div align="center">

由 [DecimalTools](https://decimaltools.com/) 维护

</div>
