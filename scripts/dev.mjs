#!/usr/bin/env node
/* =========================================================
   本地预览服务器
   用法：node scripts/dev.mjs
   默认 http://localhost:4173
   ========================================================= */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.PORT) || 4173;
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((item) => item && item.family === "IPv4" && !item.internal)
  .map((item) => item.address);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const send = (response, status, body, headers = {}) => {
  response.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-cache",
    ...headers,
  });
  response.end(body);
};

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  // 与 Cloudflare Pages 的 _redirects 保持一致，方便本地验证。
  const redirects = { "/privacy": "/privacy.html", "/thanks": "/thanks.html", "/index.html": "/" };
  if (redirects[pathname]) {
    send(response, 301, "", { Location: `${redirects[pathname]}${requestUrl.search}` });
    return;
  }

  if (pathname.endsWith("/")) pathname += "index.html";

  const filePath = path.resolve(distDir, `.${pathname}`);

  if (!filePath.startsWith(`${distDir}${path.sep}`) && filePath !== distDir) {
    send(response, 403, "Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    const body = await readFile(filePath);
    send(response, 200, body, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": body.length,
    });
  } catch (error) {
    if (request.url === "/" || pathname === "/index.html") {
      send(
        response,
        500,
        "还没有构建产物。请先运行 npm run build，再运行 npm run dev。",
        { "Content-Type": "text/plain; charset=utf-8" }
      );
      return;
    }

    try {
      const body = await readFile(path.join(distDir, "404.html"));
      send(response, 404, body, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": body.length,
      });
    } catch (notFoundError) {
      send(response, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    }
  }
});

server.listen(port, () => {
  console.log(`\n  鲸柜柜官网本地预览：http://localhost:${port}\n`);
  if (lanAddresses.length) {
    console.log("  手机同一 Wi-Fi 下可试：");
    lanAddresses.forEach((address) => console.log(`  http://${address}:${port}`));
    console.log("  若手机打不开，请在 Windows 防火墙中允许 Node.js 访问“专用网络”。\n");
  }
  console.log("  修改内容后，重新运行 npm run build 即可刷新。\n");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用。可以换一个端口：PORT=4174 npm run dev`);
    process.exitCode = 1;
    return;
  }
  throw error;
});
