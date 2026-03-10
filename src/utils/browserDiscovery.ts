import fs from "fs";
import path from "path";
import os from "os";

interface BrowserDiscoveryResult {
  executablePath: string;
  browserName: string;
}

const EDGE_PATHS: Record<string, string[]> = {
  win32: [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ],
  darwin: [
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ],
  linux: [
    "/usr/bin/microsoft-edge-stable",
    "/usr/bin/microsoft-edge",
    "/opt/microsoft/msedge/msedge",
  ],
};

const CHROME_PATHS: Record<string, string[]> = {
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ],
  linux: [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ],
};

/**
 * Find the executable for a given channel, or auto-detect Edge then Chrome.
 */
export function discoverBrowser(channel?: string): BrowserDiscoveryResult | undefined {
  // If a specific channel was requested, look for that first
  if (channel?.startsWith("msedge")) {
    const found = findFirst(EDGE_PATHS[process.platform] ?? []);
    if (found) return { executablePath: found, browserName: "msedge" };
  }

  if (channel?.startsWith("chrome")) {
    const found = findFirst(CHROME_PATHS[process.platform] ?? []);
    if (found) return { executablePath: found, browserName: "chrome" };
  }

  // No channel specified — try Edge first (match Darbot's default), then Chrome
  if (!channel) {
    const edge = findFirst(EDGE_PATHS[process.platform] ?? []);
    if (edge) return { executablePath: edge, browserName: "msedge" };

    const chrome = findFirst(CHROME_PATHS[process.platform] ?? []);
    if (chrome) return { executablePath: chrome, browserName: "chrome" };
  }

  // Let chrome-launcher handle it (will use CHROME_PATH env var or its own discovery)
  return undefined;
}

function findFirst(paths: string[]): string | undefined {
  return paths.find((p) => {
    try { return fs.existsSync(p); } catch { return false; }
  });
}

/**
 * Return a stable, platform-specific user data directory for the MCP browser.
 * Mirrors Darbot's approach: NOT a random temp dir, so logins persist.
 */
export function getStableUserDataDir(browserName: string): string {
  let cacheDir: string;
  if (process.platform === "win32")
    cacheDir = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  else if (process.platform === "darwin")
    cacheDir = path.join(os.homedir(), "Library", "Caches");
  else
    cacheDir = process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");

  return path.join(cacheDir, "ms-playwright", `mcp-${browserName}-profile`);
}
