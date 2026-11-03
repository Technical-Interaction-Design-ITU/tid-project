import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// Dev-only API (/api/search, /api/cover) so DISCOGS_TOKEN stays server-side.
// ponytail: not served by `vite build`/`preview`; move to a real backend before deploying.
const discogsApi = (mode) => ({
  name: "discogs-api",
  configureServer(server) {
    Object.assign(process.env, loadEnv(mode, process.cwd(), "")); // before the scripts are first loaded
    const send = (res, code, body) => {
      res.statusCode = code;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
    };
    server.middlewares.use("/api", async (req, res) => {
      const { pathname, searchParams: p } = new URL(req.url, "http://x");
      try {
        if (pathname === "/search") {
          const { searchAlbums } = await server.ssrLoadModule(
            "/scripts/fetch-discogs.mjs",
          );
          return send(res, 200, await searchAlbums(p.get("q") ?? ""));
        }
        if (pathname === "/cover" && /^\d+$/.test(p.get("id"))) {
          const { getCover } = await server.ssrLoadModule(
            "/scripts/fetch-cover.mjs",
          );
          return send(res, 200, {
            url: await getCover({ id: p.get("id"), cover: p.get("cover") }),
          });
        }
        send(res, 404, { error: "not found" });
      } catch (e) {
        send(res, e.status ?? 500, { error: e.message }); // e.g. Discogs 429
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), discogsApi(mode)],
}));
