(() => {
  const cfg = window.SKY_CONFIG || {};
  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const message = (id, text) => { $(id).textContent = text || ""; };

  async function checkApi() {
    try {
      const response = await fetch((cfg.workerUrl || "").replace(/\/$/, "") + "/api/health");
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      $("apiStatus").textContent = data.ok ? "API online" : "API responded";
    } catch (e) { $("apiStatus").textContent = "API unavailable"; }
  }
  checkApi();

  const fb = cfg.firebase || {};
  const missing = Object.values(fb).some(v => !v || String(v).startsWith("PASTE_"));
  if (missing || !window.firebase) {
    message("loginMessage", "Add your Firebase Web app configuration in config.js before signing in.");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(fb);
  } catch (e) {
    message("loginMessage", "Firebase setup error: " + e.message);
    return;
  }
  const auth = firebase.auth();
  const db = firebase.firestore();

  async function loadRows(collection, target, fields, limit = 50) {
    const snap = await db.collection(collection).limit(limit).get();
    $(target).innerHTML = snap.empty
      ? `<tr><td colspan="${fields.length}">No records yet.</td></tr>`
      : snap.docs.map(doc => {
          const d = doc.data();
          return `<tr>${fields.map(field => `<td>${safe(field === "__id" ? doc.id : d[field])}</td>`).join("")}</tr>`;
        }).join("");
    return snap.size;
  }

  async function loadDashboard() {
    message("dashboardMessage", "Loading records…");
    try {
      const [users, devices, activity] = await Promise.all([
        loadRows("users", "usersRows", ["__id","email","status"]),
        loadRows("devices", "devicesRows", ["__id","userId","platform"]),
        loadRows("activity", "activityRows", ["type","userId","createdAt"])
      ]);
      $("usersCount").textContent = users;
      $("devicesCount").textContent = devices;
      $("activityCount").textContent = activity;
      message("dashboardMessage", "Read-only overview loaded.");
    } catch (e) {
      message("dashboardMessage", "Could not load records. Check Firestore rules and collection names: " + e.message);
    }
  }

  auth.onAuthStateChanged(async user => {
    if (!user) {
      $("loginCard").hidden = false;
      $("dashboard").hidden = true;
      return;
    }
    try {
      const approval = await db.collection("admins").doc(user.uid).get();
      if (!approval.exists || approval.data().active !== true) {
        await auth.signOut();
        message("loginMessage", "This account is not approved as an administrator.");
        return;
      }
      $("loginCard").hidden = true;
      $("dashboard").hidden = false;
      $("signedInAs").textContent = "Signed in as " + user.email;
      await loadDashboard();
    } catch (e) {
      await auth.signOut();
      message("loginMessage", "Admin verification failed: " + e.message);
    }
  });

  $("loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    message("loginMessage", "Signing in…");
    try {
      await auth.signInWithEmailAndPassword($("email").value.trim(), $("password").value);
    } catch (e) { message("loginMessage", e.message); }
  });
  $("logoutButton").addEventListener("click", () => auth.signOut());
  document.querySelectorAll("[data-refresh]").forEach(button => button.addEventListener("click", loadDashboard));
})();
