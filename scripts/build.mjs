#!/usr/bin/env node
/* =========================================================
   鲸柜柜家居 · 静态站点构建
   用法：node scripts/build.mjs
   读取 content/*.json 与 content/projects/*.json，输出到 dist/
   ========================================================= */

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render404, renderCase, renderFactory, renderHome, renderMaterial, renderPrivacy, renderProduct, renderThanks } from "../src/template.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "content");
const projectsDir = path.join(contentDir, "projects");
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

const readJson = async (filePath) => {
  const raw = await readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`JSON 解析失败：${path.relative(rootDir, filePath)}\n${error.message}`);
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const ensureFile = async (filePath, label) => {
  try {
    const info = await stat(filePath);
    assert(info.isFile(), `${label} 不是文件：${filePath}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`缺少${label}：${path.relative(rootDir, filePath)}`);
    }
    throw error;
  }
};

const buildDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateSeries(site, materials) {
  const slugs = new Set();
  const materialSlugs = new Set(materials.items.map((item) => item.slug));

  for (const item of site.series.items) {
    const label = `content/site.json 的系列「${item.name || "未命名"}」`;
    for (const field of ["slug", "name", "english", "lead", "description", "image", "alt"]) {
      assert(typeof item[field] === "string" && item[field].trim(), `${label} 缺少字段 ${field}`);
    }
    assert(slugPattern.test(item.slug), `${label} 的 slug 只能用小写字母、数字和连字符`);
    assert(!slugs.has(item.slug), `${label} 的 slug 重复：${item.slug}`);
    slugs.add(item.slug);
    for (const field of ["paragraphs", "suitable", "details", "materialSlugs"]) {
      assert(Array.isArray(item[field]) && item[field].length > 0, `${label} 缺少数组字段 ${field}`);
    }
    for (const slug of item.materialSlugs) {
      assert(materialSlugs.has(slug), `${label} 引用了不存在的板材：${slug}`);
    }
  }
  return slugs;
}

async function loadMaterials() {
  const filePath = path.join(contentDir, "materials.json");
  const materials = await readJson(filePath);
  assert(Array.isArray(materials.items) && materials.items.length > 0, "content/materials.json 缺少 items");
  const slugs = new Set();
  for (const item of materials.items) {
    const label = `content/materials.json 的板材「${item.name || "未命名"}」`;
    for (const field of ["slug", "name", "english", "number", "swatch", "priceLevel", "summary", "core", "finish", "image", "imageAlt"]) {
      assert(typeof item[field] === "string" && item[field].trim(), `${label} 缺少字段 ${field}`);
    }
    assert(slugPattern.test(item.slug), `${label} 的 slug 只能用小写字母、数字和连字符`);
    assert(!slugs.has(item.slug), `${label} 的 slug 重复：${item.slug}`);
    slugs.add(item.slug);
    for (const field of ["brands", "advantages", "cautions", "spaces"]) {
      assert(Array.isArray(item[field]) && item[field].length > 0, `${label} 缺少数组字段 ${field}`);
    }
  }
  return materials;
}

async function loadFactory() {
  const factory = await readJson(path.join(contentDir, "factory.json"));
  for (const field of ["eyebrow", "title", "name", "location", "lead", "note"]) {
    assert(typeof factory[field] === "string" && factory[field].trim(), `content/factory.json 缺少字段 ${field}`);
  }
  for (const field of ["paragraphs", "responsibilities", "capabilities", "stats"]) {
    assert(Array.isArray(factory[field]) && factory[field].length > 0, `content/factory.json 缺少数组字段 ${field}`);
  }
  return factory;
}

async function loadProjects(site) {
  const entries = await readdir(projectsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const categories = new Set(site.projectsSection.filters.filter((item) => item !== "全部"));
  const projects = [];
  const slugs = new Set();

  for (const file of files) {
    const project = await readJson(path.join(projectsDir, file));
    const label = `content/projects/${file}`;

    if (project.draft === true) continue;

    for (const field of ["title", "category", "cover", "alt", "description", "scope", "slug", "location", "address", "locationNote", "style"]) {
      assert(
        typeof project[field] === "string" && project[field].trim(),
        `${label} 缺少字段 ${field}`
      );
    }

    assert(slugPattern.test(project.slug), `${label} 的 slug 只能用小写字母、数字和连字符`);
    assert(!slugs.has(project.slug), `${label} 的 slug 重复：${project.slug}`);
    slugs.add(project.slug);

    assert(
      categories.has(project.category),
      `${label} 的分类「${project.category}」不在 site.json 的 filters 中`
    );

    for (const field of ["highlights", "story", "materials"]) {
      assert(Array.isArray(project[field]) && project[field].length > 0, `${label} 缺少数组字段 ${field}`);
    }

    projects.push({
      ...project,
      order: Number.isFinite(Number(project.order)) ? Number(project.order) : 999,
      _file: file,
    });
  }

  projects.sort((a, b) => a.order - b.order || a._file.localeCompare(b._file, "zh-CN"));
  return projects;
}

function collectImagePaths(site, projects, materials) {
  return [
    site.seo.ogImage,
    site.hero.image,
    site.about.image,
    site.about.detailImage,
    ...site.series.items.map((item) => item.image),
    site.philosophy.image,
    site.craft.image,
    ...projects.map((project) => project.cover),
    ...materials.items.map((item) => item.image),
  ].filter(Boolean);
}

async function validateImages(site, projects, materials) {
  const paths = [...new Set(collectImagePaths(site, projects, materials))];

  for (const imagePath of paths) {
    assert(imagePath.startsWith("/"), `图片路径必须以 / 开头：${imagePath}`);
    await ensureFile(
      path.join(publicDir, imagePath.replace(/^\//, "")),
      `图片 ${imagePath}`
    );
  }

  return paths;
}

function sitemapXml(site, projects, materials) {
  const base = site.seo.siteUrl.replace(/\/$/, "");
  const pages = [
    { loc: `${base}/`, changefreq: "monthly", priority: "1.0" },
    { loc: `${base}/factory.html`, changefreq: "monthly", priority: "0.7" },
    ...site.series.items.map((item) => ({ loc: `${base}/products/${item.slug}.html`, changefreq: "monthly", priority: "0.8" })),
    ...projects.map((project) => ({ loc: `${base}/cases/${project.slug}.html`, changefreq: "monthly", priority: "0.7" })),
    ...materials.items.map((item) => ({ loc: `${base}/materials/${item.slug}.html`, changefreq: "monthly", priority: "0.6" })),
    { loc: `${base}/privacy`, changefreq: "yearly", priority: "0.3" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.loc.replace(/\.html$/, "")}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function robotsTxt(site) {
  const base = site.seo.siteUrl.replace(/\/$/, "");
  return `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
}

async function copyPublic() {
  const entries = await readdir(publicDir, { withFileTypes: true });

  for (const entry of entries) {
    await cp(path.join(publicDir, entry.name), path.join(distDir, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

async function main() {
  console.log("→ 读取内容…");

  const site = await readJson(path.join(contentDir, "site.json"));
  const privacy = await readJson(path.join(contentDir, "privacy.json"));
  const materials = await loadMaterials();
  const factory = await loadFactory();

  for (const field of ["brand", "seo", "hero", "intro", "about", "series", "philosophy", "process", "projectsSection", "craft", "contact", "footer"]) {
    assert(site[field], `content/site.json 缺少 ${field}`);
  }

  validateSeries(site, materials);
  const projects = await loadProjects(site);
  assert(projects.length > 0, "content/projects 里还没有可发布的案例");

  console.log(`  ${projects.length} 个案例，${site.series.items.length} 个产品系列，${materials.items.length} 种板材`);

  const imagePaths = await validateImages(site, projects, materials);
  console.log(`  ${imagePaths.length} 张图片引用检查通过`);

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  console.log("→ 复制静态资源…");
  await copyPublic();
  await cp(path.join(srcDir, "styles.css"), path.join(distDir, "styles.css"));
  await cp(path.join(srcDir, "main.js"), path.join(distDir, "main.js"));

  const writePage = async (relativePath, html) => {
    const target = path.join(distDir, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, "utf8");
  };

  console.log("→ 生成页面…");
  await writePage("index.html", renderHome({ site, projects, materials, factory }));
  await writePage("factory.html", renderFactory({ site, factory }));
  for (const product of site.series.items) {
    await writePage(`products/${product.slug}.html`, renderProduct({ site, product, projects, materials }));
  }
  for (const project of projects) {
    const sameCategory = projects.filter((item) => item.slug !== project.slug && item.category === project.category);
    const others = projects.filter((item) => item.slug !== project.slug && item.category !== project.category);
    const nearby = [...sameCategory, ...others].slice(0, 3);
    await writePage(`cases/${project.slug}.html`, renderCase({ site, project, nearby }));
  }
  for (const material of materials.items) {
    await writePage(`materials/${material.slug}.html`, renderMaterial({ site, material, products: site.series.items }));
  }
  await writePage("privacy.html", renderPrivacy({ site, privacy }));
  await writePage("404.html", render404({ site }));
  await writePage("thanks.html", renderThanks({ site }));
  await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml(site, projects, materials), "utf8");
  await writeFile(path.join(distDir, "robots.txt"), robotsTxt(site), "utf8");

  console.log("→ 检查上线配置…");
  if (!site.contact.formEmail) {
    console.warn("  ! contact.formEmail 为空：预约表单会提示“尚未接通”，不会假装提交成功");
  }
  if (!site.footer.icp) {
    console.log("  · footer.icp 为空：页脚不会显示备案号（使用中国大陆服务器时需要填写）");
  }
  if (!/(^|\.)jingguigui\.(com|cn)$/.test(new URL(site.seo.siteUrl).hostname)) {
    console.warn(`  ! seo.siteUrl 当前为 ${site.seo.siteUrl}，上线前请改成实际域名`);
  }

  console.log(`\n✓ 构建完成：${path.relative(process.cwd(), distDir) || "dist"}`);
  console.log("  本地预览：npm run dev");
}

main().catch((error) => {
  console.error(`\n✗ 构建失败：${error.message}`);
  process.exitCode = 1;
});
