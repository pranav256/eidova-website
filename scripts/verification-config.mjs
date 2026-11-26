import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function localPath(value, name, allowFileUrl = false) {
  if (typeof value !== 'string' || !value.trim() || /[\0\r\n]/.test(value)) {
    throw new TypeError(`${name} must be a nonempty filesystem path.`);
  }
  if (allowFileUrl && /^file:/i.test(value)) {
    try {
      const url = new URL(value);
      if (url.search || url.hash) throw new Error('Use a directory URL without query or fragment.');
      return fileURLToPath(url);
    } catch (cause) { throw new TypeError(`${name} must be a valid file URL.`, { cause }); }
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^[a-z]:[\\/]/i.test(value)) {
    throw new TypeError(`${name} must be a filesystem path${allowFileUrl ? ' or file URL' : ''}.`);
  }
  return resolve(value);
}

export function browserLaunchOptions(env = process.env, platform = process.platform) {
  if (env.BROWSER_EXECUTABLE !== undefined) {
    return { executablePath: localPath(env.BROWSER_EXECUTABLE, 'BROWSER_EXECUTABLE'), headless: true };
  }
  return { channel: platform === 'win32' ? 'msedge' : undefined, headless: true };
}

export function mcpFile(relative, env = process.env) {
  const root = env.MCP_ROOT === undefined
    ? fileURLToPath(new URL('../../eidova-mcp/', import.meta.url))
    : localPath(env.MCP_ROOT, 'MCP_ROOT', true);
  return pathToFileURL(resolve(root, relative));
}

export const normalizeLineEndings = text => text.replace(/\r\n/g, '\n');
