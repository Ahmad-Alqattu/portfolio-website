const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

setGlobalOptions({region: "us-central1", maxInstances: 1});

// Fine-grained GitHub token scoped to Ahmad-Alqattu/portfolio-website with
// "Contents: Read and write" only (that is what repository_dispatch needs).
// Set with: firebase functions:secrets:set GITHUB_DISPATCH_TOKEN
const githubToken = defineSecret("GITHUB_DISPATCH_TOKEN");

const ADMIN_EMAIL = "ahmadl.qatu@gmail.com";
const REPO = "Ahmad-Alqattu/portfolio-website";
const MIN_INTERVAL_MS = 3 * 60 * 1000;

// "Publish" in the admin panel: asks GitHub Actions to rebuild and
// prerender the site from the current Firestore content and deploy it
// (.github/workflows/deploy.yml, repository_dispatch type "publish").
// Visitors already see edits live; this refreshes what search engines and
// AI agents read.
exports.publishSite = onCall({secrets: [githubToken]}, async (request) => {
  const token = request.auth && request.auth.token;
  if (!token || token.email !== ADMIN_EMAIL || token.email_verified !== true) {
    throw new HttpsError("permission-denied", "Only the site owner can publish.");
  }

  // One publish every few minutes is plenty; also protects the Actions quota.
  const ref = admin.firestore().doc("meta/publish");
  const now = Date.now();
  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const last = snap.exists ? snap.get("requestedAt") || 0 : 0;
    if (now - last < MIN_INTERVAL_MS) {
      const wait = Math.ceil((MIN_INTERVAL_MS - (now - last)) / 1000);
      throw new HttpsError("resource-exhausted", `Published recently; try again in ${wait}s.`);
    }
    tx.set(ref, {requestedAt: now, requestedBy: token.email});
  });

  let res;
  try {
    res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${githubToken.value()}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "portfolio-publish",
      },
      body: JSON.stringify({event_type: "publish"}),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    // Nothing was dispatched: release the rate limit so a retry works.
    await ref.delete();
    throw new HttpsError("unavailable", `Could not reach GitHub: ${err.message}`);
  }
  if (res.status !== 204) {
    await ref.delete();
    throw new HttpsError("internal", `GitHub refused the publish request (${res.status}).`);
  }

  return {ok: true, actionsUrl: `https://github.com/${REPO}/actions/workflows/deploy.yml`};
});
