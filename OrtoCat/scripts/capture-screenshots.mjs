import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const modules = ["OrtoCat-BV", "OrtoCat-GJTG", "OrtoCat-SSCZ", "OrtoCat-XTXIG", "OrtoCat-LLL"];
const port = 4173;
const debugPort = 9337;

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  let file = path.resolve(root, relative);
  if (!file.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader("Content-Type", mimeTypes[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
const profile = path.join(process.env.TEMP || root, `ortocat-screenshots-${Date.now()}`);
const browser = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
], { stdio: "ignore" });

async function waitForDebugger() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Chrome no ha obert el port de depuració");
}

async function openPage(url) {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });
  const target = await response.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const runtimeErrors = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
    if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      runtimeErrors.push(message.params.args.map((arg) => arg.value || arg.description).join(" "));
    }
  });
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
  await send("Runtime.enable");
  await send("Page.enable");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return { socket, send, runtimeErrors };
}

async function screenshot(page, output, width, height) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 420,
  });
  await new Promise((resolve) => setTimeout(resolve, 250));
  const result = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  fs.writeFileSync(output, Buffer.from(result.result.data, "base64"));
}

try {
  await waitForDebugger();
  for (const moduleName of modules) {
    const page = await openPage(`http://127.0.0.1:${port}/${moduleName}/`);
    const rendered = await page.send("Runtime.evaluate", {
      expression: `({
        rule: document.querySelector("#ruleCard")?.textContent.trim(),
        resources: performance.getEntriesByType("resource").map((entry) => entry.name),
      })`,
      returnByValue: true,
    });
    if (!rendered.result.result.value?.rule) {
      throw new Error(`${moduleName} no ha renderitzat: ${JSON.stringify(rendered.result.result.value)} ${page.runtimeErrors.join(", ")}`);
    }
    const outputDir = path.join(root, moduleName, "assets", "screenshots");
    await screenshot(page, path.join(outputDir, "ortocast-estudio.png"), 1280, 720);
    await page.send("Runtime.evaluate", {
      expression: 'document.querySelector(\'[data-view="guided"]\').click()',
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    await screenshot(page, path.join(outputDir, "ortocast-practica.png"), 1280, 720);
    const partialResult = await page.send("Runtime.evaluate", {
      expression: `(() => {
        const cards = [...document.querySelectorAll("#guidedPractice .question-card")];
        cards[0].querySelector("[data-pick]").click();
        document.querySelector("#checkGuided").click();
        const firstPass = cards.filter((card) => card.dataset.checked === "true").length;
        cards.slice(1).forEach((card) => card.querySelector("[data-pick]:not(:disabled)").click());
        document.querySelector("#checkGuided").click();
        return {
          firstPass,
          finalPass: cards.filter((card) => card.dataset.checked === "true").length,
          total: cards.length,
        };
      })()`,
      returnByValue: true,
    });
    const partial = partialResult.result.result.value;
    if (partial.firstPass !== 1 || partial.finalPass !== partial.total) {
      throw new Error(`${moduleName}: la correcció parcial no s'ha completat correctament`);
    }
    await page.send("Runtime.evaluate", {
      expression: 'document.querySelector(\'[data-view="study"]\').click()',
    });
    await screenshot(page, path.join(outputDir, "ortocast-movil.png"), 390, 844);
    if (page.runtimeErrors.length) throw new Error(`${moduleName}: ${page.runtimeErrors.join(", ")}`);
    page.socket.close();
  }
  console.log(`Captures actualitzades: ${modules.length} mòduls.`);
} finally {
  browser.kill();
  server.close();
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    fs.rmSync(profile, { recursive: true, force: true });
  } catch {}
}
