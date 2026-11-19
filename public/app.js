(() => {
  const cfg = window.SKY_CONFIG || {};
  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  
  // Made this null-safe so it doesn't crash if the login message box is missing
  const message = (id, text) => { const el = $(id); if (el) el.textContent = text || ""; };

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
  if (!window.firebase) {
    console.error("Firebase SDK not loaded.");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(fb);
  } catch (e) {
    console.error("Firebase setup error: " + e.message);
    return;
  }
  
  const db = firebase.firestore();

  async function loadRows(collection, target, fields, limit = 50) {
    try {
      const snap = await db.collection(collection).limit(limit).get();
      $(target).innerHTML = snap.empty
        ? `<tr><td colspan="${fields.length}">No records yet.</td></tr>`
        : snap.docs.map(doc => {
            const d = doc.data();
            return `<tr>${fields.map(field => `<td>${safe(field === "__id" ? doc.id : d[field])}</td>`).join("")}</tr>`;
          }).join("");
      return snap.size;
    } catch (error) {
      // This will catch Firestore permission errors
      throw new Error(`Could not read '${collection}': ${error.message}`);
    }
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
      message("dashboardMessage", "Error: " + e.message);
    }
  }

  // --- BYPASS LOGIN: Load the dashboard immediately ---
  $("signedInAs").textContent = "Access: Bypassed (No Auth)";
  loadDashboard();

  // Refresh buttons
  document.querySelectorAll("[data-refresh]").forEach(button => button.addEventListener("click", loadDashboard));
})();
