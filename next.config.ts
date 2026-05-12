import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** この設定ファイルがあるディレクトリ＝アプリのルート（親の誤った lockfile による Turbopack ルート誤認識を防ぐ） */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
