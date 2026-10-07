/* GYCalc service worker. Generated into out/sw.js by scripts/pwa/build-sw.mjs; do not edit out/sw.js.
 *
 * Privacy invariant: this worker only ever handles GET requests for static files on its own origin,
 * under its own scope, with no query string. Calculators run in the page and never send values to
 * any URL, so nothing a person types can reach this worker or its caches. Anything else is left
 * to the browser untouched.
 */
const BUILD_ID = "qnWgKsCX1O_lo495MMWW1-69ebf8c5"
const CACHE_PREFIX = "gycalc-"
const CACHE = CACHE_PREFIX + BUILD_ID
// Lazy report files (PDF engine, fonts, logo) are not precached. They live in one long-lived cache
// whose name does NOT start with CACHE_PREFIX, so a deploy never deletes them. Their URLs are content
// hashed; on activate, entries that are no longer in LAZY_ASSETS (stale versions) are pruned.
const REPORT_CACHE = "gyreports-v1"
const LAZY_ASSETS = [
  "/gy-taxcalc/_next/static/media/inter-latin-400-normal.2qdljeg3s-lsl.woff2",
  "/gy-taxcalc/_next/static/media/inter-latin-600-normal.2dov6rjg62vru.woff2",
  "/gy-taxcalc/_next/static/media/inter-latin-700-normal.4421omqeymgmp.woff2",
  "/gy-taxcalc/_next/static/media/takumi_pdf_wasm_bg.0jpos0eibpt7a.wasm"
]
const BASE = "/gy-taxcalc" // "/gy-taxcalc"
const SCOPE_PREFIX = BASE + "/"
// The archived previous version lives at /gy-taxcalc/v1/, inside this scope. It is a separate frozen
// app: this worker never answers, caches or falls back for it (the browser handles those requests).
const ARCHIVE = BASE + "/v1"
const NOT_FOUND_PAGE = BASE + "/404.html"
const PRECACHE = [
  "/gy-taxcalc/",
  "/gy-taxcalc/404.html",
  "/gy-taxcalc/__next.__PAGE__.txt",
  "/gy-taxcalc/__next._full.txt",
  "/gy-taxcalc/__next._tree.txt",
  "/gy-taxcalc/_next/static/chunks/009or5bt55fdf.js",
  "/gy-taxcalc/_next/static/chunks/011k0e8jf39vu.js",
  "/gy-taxcalc/_next/static/chunks/01or7bqe0ydg0.js",
  "/gy-taxcalc/_next/static/chunks/04z0b4zxkywu9.js",
  "/gy-taxcalc/_next/static/chunks/066gnlvj2w1kv.js",
  "/gy-taxcalc/_next/static/chunks/09dp90g-twjwq.js",
  "/gy-taxcalc/_next/static/chunks/0ak7utvzn6euy.js",
  "/gy-taxcalc/_next/static/chunks/0axdrs6tow-4n.js",
  "/gy-taxcalc/_next/static/chunks/0cz1d0mv5g_q7.js",
  "/gy-taxcalc/_next/static/chunks/0i-lcqgoak5_h.js",
  "/gy-taxcalc/_next/static/chunks/0pkv-swh350h5.js",
  "/gy-taxcalc/_next/static/chunks/0r_9lfordfffz.js",
  "/gy-taxcalc/_next/static/chunks/0rjznfvwsgg8c.js",
  "/gy-taxcalc/_next/static/chunks/0tvm7as1dqyu4.js",
  "/gy-taxcalc/_next/static/chunks/0z9i43_sqhc80.js",
  "/gy-taxcalc/_next/static/chunks/10y16f-0r67n6.js",
  "/gy-taxcalc/_next/static/chunks/132v-gfv-h6en.js",
  "/gy-taxcalc/_next/static/chunks/175j9413f79ew.js",
  "/gy-taxcalc/_next/static/chunks/184fdigv707ht.js",
  "/gy-taxcalc/_next/static/chunks/1ap108b9g0d_s.js",
  "/gy-taxcalc/_next/static/chunks/1b05si5ksuifz.js",
  "/gy-taxcalc/_next/static/chunks/1blmol12a9gw3.js",
  "/gy-taxcalc/_next/static/chunks/1bvzr4lofbimx.js",
  "/gy-taxcalc/_next/static/chunks/1cyjp3q-y3_ek.js",
  "/gy-taxcalc/_next/static/chunks/1d69bhpvc8x5h.js",
  "/gy-taxcalc/_next/static/chunks/1gs4uznwuk_cq.js",
  "/gy-taxcalc/_next/static/chunks/1kga07t_jp93g.js",
  "/gy-taxcalc/_next/static/chunks/1nd1cqlon6j7f.js",
  "/gy-taxcalc/_next/static/chunks/1y7uhkgp49x6u.js",
  "/gy-taxcalc/_next/static/chunks/2-7s0vgbne_9v.js",
  "/gy-taxcalc/_next/static/chunks/210t_4v80p-a8.css",
  "/gy-taxcalc/_next/static/chunks/21xboegp9xh5y.js",
  "/gy-taxcalc/_next/static/chunks/2294098e-cymw.js",
  "/gy-taxcalc/_next/static/chunks/2az4v0ah3csfp.js",
  "/gy-taxcalc/_next/static/chunks/2covgvyy662a2.js",
  "/gy-taxcalc/_next/static/chunks/2e3w9d2xzl11c.js",
  "/gy-taxcalc/_next/static/chunks/2ffppep-4ntyf.js",
  "/gy-taxcalc/_next/static/chunks/2gx6h6dj-_j3a.css",
  "/gy-taxcalc/_next/static/chunks/2l8yl15ml5scf.js",
  "/gy-taxcalc/_next/static/chunks/2o2_oxojg0r5b.js",
  "/gy-taxcalc/_next/static/chunks/2sfcuyliagl78.js",
  "/gy-taxcalc/_next/static/chunks/2w0-vq5-kwdgc.js",
  "/gy-taxcalc/_next/static/chunks/2zwapkf-axvno.js",
  "/gy-taxcalc/_next/static/chunks/33_q6vp_pfd5_.js",
  "/gy-taxcalc/_next/static/chunks/33d3wbcy7ryk9.js",
  "/gy-taxcalc/_next/static/chunks/347e61mdyc-oz.js",
  "/gy-taxcalc/_next/static/chunks/34ts-wxmn8cw8.js",
  "/gy-taxcalc/_next/static/chunks/3_tt2rzt3b5kk.js",
  "/gy-taxcalc/_next/static/chunks/3d7s0knon9ets.js",
  "/gy-taxcalc/_next/static/chunks/3fntmmi971322.js",
  "/gy-taxcalc/_next/static/chunks/3iqvs36wyh4d3.js",
  "/gy-taxcalc/_next/static/chunks/3j6ls5h1dd4pk.js",
  "/gy-taxcalc/_next/static/chunks/3jn49jvh3hjyr.js",
  "/gy-taxcalc/_next/static/chunks/3o9hnlscx8qsb.js",
  "/gy-taxcalc/_next/static/chunks/3phd-0vyjop88.js",
  "/gy-taxcalc/_next/static/chunks/3pre1dtcvu4sc.js",
  "/gy-taxcalc/_next/static/chunks/3s6nzrbk-8mnv.js",
  "/gy-taxcalc/_next/static/chunks/3ssu868wmzxus.js",
  "/gy-taxcalc/_next/static/chunks/3vf2p_bcdecyl.js",
  "/gy-taxcalc/_next/static/chunks/3wsomt6g8zmww.js",
  "/gy-taxcalc/_next/static/chunks/42z3jw1kgob9p.js",
  "/gy-taxcalc/_next/static/chunks/turbopack-34btb6ruzl6--.js",
  "/gy-taxcalc/_next/static/media/1bffadaabf893a1e-s.3-6t-g6q0vh0a.woff2",
  "/gy-taxcalc/_next/static/media/2bbe8d2671613f1f-s.0k62hbripvv8p.woff2",
  "/gy-taxcalc/_next/static/media/2c55a0e60120577a-s.0-dom-5bn10r2.woff2",
  "/gy-taxcalc/_next/static/media/5476f68d60460930-s.2uwcyprjm3xu3.woff2",
  "/gy-taxcalc/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2",
  "/gy-taxcalc/_next/static/media/9c72aa0f40e4eef8-s.1y4-pdgsjb-pw.woff2",
  "/gy-taxcalc/_next/static/media/ad66f9afd8947f86-s.3lvt2whj97whp.woff2",
  "/gy-taxcalc/_next/static/media/apple-icon.0fqn_8axjrsk1.png",
  "/gy-taxcalc/_next/static/media/gycalc-mark-128.0xc_tlpr2s587.png",
  "/gy-taxcalc/_next/static/media/icon.3qgzf1_wswb86.png",
  "/gy-taxcalc/_next/static/qnWgKsCX1O_lo495MMWW1/_buildManifest.js",
  "/gy-taxcalc/_next/static/qnWgKsCX1O_lo495MMWW1/_clientMiddlewareManifest.js",
  "/gy-taxcalc/_next/static/qnWgKsCX1O_lo495MMWW1/_ssgManifest.js",
  "/gy-taxcalc/_not-found/",
  "/gy-taxcalc/_not-found/__next._full.txt",
  "/gy-taxcalc/_not-found/__next._not-found.__PAGE__.txt",
  "/gy-taxcalc/_not-found/__next._tree.txt",
  "/gy-taxcalc/_not-found/index.txt",
  "/gy-taxcalc/analytics/",
  "/gy-taxcalc/analytics/__next.!KGFwcCk.analytics.__PAGE__.txt",
  "/gy-taxcalc/analytics/__next._full.txt",
  "/gy-taxcalc/analytics/__next._tree.txt",
  "/gy-taxcalc/analytics/index.txt",
  "/gy-taxcalc/apple-icon.png",
  "/gy-taxcalc/changelog/",
  "/gy-taxcalc/changelog/__next.!KGFwcCk.changelog.__PAGE__.txt",
  "/gy-taxcalc/changelog/__next._full.txt",
  "/gy-taxcalc/changelog/__next._tree.txt",
  "/gy-taxcalc/changelog/index.txt",
  "/gy-taxcalc/compare/",
  "/gy-taxcalc/compare/__next.!KGFwcCk.compare.__PAGE__.txt",
  "/gy-taxcalc/compare/__next._full.txt",
  "/gy-taxcalc/compare/__next._tree.txt",
  "/gy-taxcalc/compare/index.txt",
  "/gy-taxcalc/dashboard/",
  "/gy-taxcalc/dashboard/__next.!KGFwcCk.dashboard.__PAGE__.txt",
  "/gy-taxcalc/dashboard/__next._full.txt",
  "/gy-taxcalc/dashboard/__next._tree.txt",
  "/gy-taxcalc/dashboard/index.txt",
  "/gy-taxcalc/faq/",
  "/gy-taxcalc/faq/__next.!KGFwcCk.faq.__PAGE__.txt",
  "/gy-taxcalc/faq/__next._full.txt",
  "/gy-taxcalc/faq/__next._tree.txt",
  "/gy-taxcalc/faq/index.txt",
  "/gy-taxcalc/icon.png",
  "/gy-taxcalc/icons/icon-192.png",
  "/gy-taxcalc/icons/icon-512.png",
  "/gy-taxcalc/icons/icon-maskable-512.png",
  "/gy-taxcalc/index.txt",
  "/gy-taxcalc/insights/",
  "/gy-taxcalc/insights/__next.!KGFwcCk.insights.__PAGE__.txt",
  "/gy-taxcalc/insights/__next._full.txt",
  "/gy-taxcalc/insights/__next._tree.txt",
  "/gy-taxcalc/insights/index.txt",
  "/gy-taxcalc/intelligence/",
  "/gy-taxcalc/intelligence/__next.!KGFwcCk.intelligence.__PAGE__.txt",
  "/gy-taxcalc/intelligence/__next._full.txt",
  "/gy-taxcalc/intelligence/__next._tree.txt",
  "/gy-taxcalc/intelligence/index.txt",
  "/gy-taxcalc/loan/",
  "/gy-taxcalc/loan/__next.!KGFwcCk.loan.__PAGE__.txt",
  "/gy-taxcalc/loan/__next._full.txt",
  "/gy-taxcalc/loan/__next._tree.txt",
  "/gy-taxcalc/loan/index.txt",
  "/gy-taxcalc/manifest.webmanifest",
  "/gy-taxcalc/methodology/",
  "/gy-taxcalc/methodology/__next.!KGFwcCk.methodology.__PAGE__.txt",
  "/gy-taxcalc/methodology/__next._full.txt",
  "/gy-taxcalc/methodology/__next._tree.txt",
  "/gy-taxcalc/methodology/index.txt",
  "/gy-taxcalc/overview/",
  "/gy-taxcalc/overview/__next.!KGFwcCk.overview.__PAGE__.txt",
  "/gy-taxcalc/overview/__next._full.txt",
  "/gy-taxcalc/overview/__next._tree.txt",
  "/gy-taxcalc/overview/index.txt",
  "/gy-taxcalc/planner/",
  "/gy-taxcalc/planner/__next.!KGFwcCk.planner.__PAGE__.txt",
  "/gy-taxcalc/planner/__next._full.txt",
  "/gy-taxcalc/planner/__next._tree.txt",
  "/gy-taxcalc/planner/index.txt",
  "/gy-taxcalc/readme-hero.svg",
  "/gy-taxcalc/tax-info/",
  "/gy-taxcalc/tax-info/__next.!KGFwcCk.tax-info.__PAGE__.txt",
  "/gy-taxcalc/tax-info/__next._full.txt",
  "/gy-taxcalc/tax-info/__next._tree.txt",
  "/gy-taxcalc/tax-info/index.txt",
  "/gy-taxcalc/vehicle/",
  "/gy-taxcalc/vehicle/__next.!KGFwcCk.vehicle.__PAGE__.txt",
  "/gy-taxcalc/vehicle/__next._full.txt",
  "/gy-taxcalc/vehicle/__next._tree.txt",
  "/gy-taxcalc/vehicle/index.txt"
]
const NAVIGATION_TIMEOUT_MS = 4000

self.addEventListener("install", (event) => {
  // No skipWaiting here: an update waits until the person chooses to refresh (see the page's
  // "A new version is available" toast), so a calculation is never interrupted.
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      try {
        await Promise.all(
          PRECACHE.map((url) =>
            fetch(url, { cache: "reload" }).then((res) => {
              if (!res.ok) throw new Error("precache failed: " + url + " " + res.status)
              return cache.put(url, res)
            })
          )
        )
      } catch (err) {
        // Fail safe: this worker does not install, the current one keeps working, and no
        // half-filled cache is left behind.
        await caches.delete(CACHE)
        throw err
      }
    })()
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE).map((n) => caches.delete(n))
      )
      // Only if it exists: opening would create it, and a first visit must leave no report cache behind.
      if (await caches.has(REPORT_CACHE)) {
        const reports = await caches.open(REPORT_CACHE)
        for (const req of await reports.keys()) {
          if (!LAZY_ASSETS.includes(new URL(req.url).pathname)) await reports.delete(req)
        }
      }
      await self.clients.claim()
    })()
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

function isArchive(pathname) {
  return pathname === ARCHIVE || pathname.startsWith(ARCHIVE + "/")
}

/** True only for the requests this worker is allowed to touch. */
function isHandled(request) {
  if (request.method !== "GET") return false
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false
  if (!url.pathname.startsWith(SCOPE_PREFIX)) return false
  if (isArchive(url.pathname)) return false
  if (url.search !== "" || url.hash !== "") return false
  return true
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  // Navigations may carry a query string; they are served network-first and never written to a
  // cache, so a URL with values is never stored.
  if (request.mode === "navigate" && request.method === "GET") {
    const url = new URL(request.url)
    if (url.origin === self.location.origin && url.pathname.startsWith(SCOPE_PREFIX) && !isArchive(url.pathname)) {
      event.respondWith(navigate(request, url))
    }
    return
  }
  if (!isHandled(request)) return
  const url = new URL(request.url)
  // The encrypted pay scale always goes to the network (the browser's own cache rules apply): never serve it from here.
  if (url.pathname === BASE + "/org-scale.enc.json") return
  if (LAZY_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, REPORT_CACHE))
  } else if (url.pathname.startsWith(BASE + "/_next/static/")) {
    event.respondWith(cacheFirst(request, CACHE))
  } else {
    event.respondWith(staleWhileRevalidate(request, event))
  }
})

async function cachedPage(url) {
  const cache = await caches.open(CACHE)
  // Match by path only: the stored pages are the build's own static HTML.
  const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/"
  const hit = (await cache.match(path)) || (await cache.match(url.pathname))
  if (hit) return hit
  // An unknown path offline gets the app's own not-found page (with a 404 status), never another
  // page's HTML, which would not match the URL and would fail to hydrate.
  const nf = await cache.match(NOT_FOUND_PAGE)
  return nf ? new Response(nf.body, { status: 404, statusText: "Not Found", headers: nf.headers }) : undefined
}

async function navigate(request, url) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), NAVIGATION_TIMEOUT_MS)
    const res = await fetch(request, { signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch {
    const fallback = await cachedPage(url)
    if (fallback) return fallback
    return Response.error()
  }
}

async function cacheFirst(request, name) {
  const cache = await caches.open(name)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  if (res.ok) cache.put(request, res.clone())
  return res
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone())
      return res
    })
    .catch(() => undefined)
  if (hit) {
    event.waitUntil(refresh)
    return hit
  }
  return (await refresh) || Response.error()
}
