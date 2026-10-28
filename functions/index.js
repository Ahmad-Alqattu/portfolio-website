const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");


admin.initializeApp();

setGlobalOptions({region: "us-central1"});

// Make the sitemap publicly invocable and allow CORS
exports.sitemap = onRequest({ cors: true, invoker: "public" }, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = "default-user";

    const snapshot = await db.collection(`users/${userId}/sections`).get();
    const sections = [];
    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      // include only active sections (default to active if field missing)
      // footerAndLinks (and anything similarly non-navigable) isn't a routed
      // page — it renders globally in the layout, not as a scrollable
      // section — so including it here just puts a meaningless URL in the
      // sitemap for Google to trip over.
      if (data.active !== false && data.type !== 'footerAndLinks') {
        sections.push({ id: doc.id, type: data.type, order: data.order ?? 999 });
      }
    });

    // sort by order
    sections.sort((a, b) => (a.order || 999) - (b.order || 999));

    // Build baseUrl from request host to avoid hardcoding domains
    const forwardedHost = req.headers['x-forwarded-host'];
    const host = forwardedHost ? forwardedHost.split(',')[0].trim() : (req.headers.host || '');
    const forwardedProto = req.headers['x-forwarded-proto'];
    const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.protocol || 'https');
    const baseUrl = `${proto}://${host}`;

    const pathFor = (sec) => {
      const t = (sec.type || sec.id || '').toLowerCase();
      if (t === 'intro') return '/about';
      return `/${sec.id}`;
    };

    let xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

    // root page
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // section routes (distinct URLs per section)
    sections.forEach((sec) => {
      const path = pathFor(sec);
      xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += "</urlset>";

    res.set("Content-Type", "application/xml");
    // Cache for a day to reduce load
    res.set("Cache-Control", "public, max-age=86400");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Error generating sitemap:", err);
    res.status(500).send("Error generating sitemap");
  }
});