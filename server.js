import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import formSubmit from "./api/form-submit.js";

const port = Number(process.env.PORT || 3000);
const root = resolve(".");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function apiResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
  };
  return res;
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === "/api/form-submit") {
    try {
      req.body = await readJson(req);
      await formSubmit(req, apiResponse(res));
    } catch {
      apiResponse(res).status(400).json({ error: "Invalid JSON body." });
    }
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    apiResponse(res).status(404).json({ error: "API route not found." });
    return;
  }

  const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  let filePath = resolve(root, requested);
  if (!filePath.startsWith(root + sep) && filePath !== resolve(root, "index.html")) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    res.end(file);
  } catch {
    filePath = resolve(root, "index.html");
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(file);
  }
});

server.listen(port, () => {
  console.log(`ATD website running at http://localhost:${port}`);
});
