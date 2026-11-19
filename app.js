import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const cfg = window.SKY_CONFIG;
const $ = (id) => document.getElementById(id);
const loginView = $("loginView");
const dashboardView = $("dashboardView");
const loginMessage = $("loginMessage");
const notice = $("notice");

function showNotice(message, error = false) {
  notice.textContent = message;
  notice.classList.remove("hidden", "error");
  if (error) notice.classList.add("error");
}
function hideNotice() { notice.classList.add("hidden"); }

function configIsReady() {
  const f = cfg?.firebase;
  return f && f.apiKey && !f.apiKey.startsWith("PASTE_") &&
    f.projectId && f.appId && !f.appId.startsWith("PASTE_");
}

if (!configIsReady()) {
  loginMessage.textContent = "Setup required: add your Firebase Web app configuration in config.js, then reload this page.";
  loginMessage.className = "message error";
  $("connection").innerHTML = "<i></i> Setup required";
} else {
  const app = initializeApp(cfg.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);

  async function checkWorker() {
    try {
      const response = await fetch(`${cfg.workerUrl.replace(/\/$/, "")}/api/health`);
      if (!response.ok) throw new Error("Health check failed");
      const data = await response.json();
      $("connection").innerHTML = "<i></i> API online";
      $("apiStatus").textContent = "Online";
      $("apiStatus").className = "status-text good";
      $("apiDetail").textContent = data.app || data.application || "Cloudflare Worker";
    } catch {
      $("connection").innerHTML = "<i class='bad-dot'></i> API unavailable";
      $("apiStatus").textContent = "Offline";
      $("apiStatus").className = "status-text bad";
      $("apiDetail").textContent = "Check Worker URL and deployment";
    }
  }

  async function isApprovedAdmin(user) {
    // Admin approval is controlled manually in Firestore. A normal signed-in
    // Firebase user is NOT automatically an administrator.
    const adminSnap = await getDoc(doc(db, "admins", user.uid));
    return adminSnap.exists() && adminSnap.data().active === true;
  }

  function safeText(value) {
    return String(value ?? "—").replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
  }
  function timeText(value) {
    if (!value) return "—";
    const date = value.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  }
  function row(cells) {
    return `<tr>${cells.map(v => `<td>${v}</td>`).join("")}</tr>`;
  }
  function setRows(id, html, emptyText) {
    $(id).innerHTML = html || `<tr><td colspan="3" class="empty">${emptyText}</td></tr>`;
  }

  async function loadCollection(name, max = 50, sortField = null) {
    const ref = collection(db, name);
    const q = sortField ? query(ref, orderBy(sortField, "desc"), limit(max)) : query(ref, limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function loadDashboard() {
    hideNotice();
    try {
      const [users, devices, activities] = await Promise.all([
        loadCollection("users", 100),
        loadCollection("devices", 100),
        loadCollection("activity", 20, "createdAt")
      ]);
      $("usersCount").textContent = users.length;
      $("devicesCount").textContent = devices.length;
      $("activityCount").textContent = activities.length;

      setRows("usersRows", users.map(u => row([
        safeText(u.displayName || u.name || u.id.slice(0, 12)),
        safeText(u.email),
        `<span class="pill">${safeText(u.status || "registered")}</span>`
      ])).join(""), "No registered users found.");

      setRows("devicesRows", devices.map(d => row([
        safeText(d.deviceName || d.deviceModel || d.platform || d.id),
        safeText(d.userId),
        `<span class="pill">${safeText(d.status || "registered")}</span>`
      ])).join(""), "No registered devices found.");

      setRows("activityRows", activities.map(a => row([
        safeText(a.event || a.action || a.type || "Activity"),
        safeText(a.userId),
        safeText(timeText(a.createdAt))
      ])).join(""), "No activity records found.");
    } catch (error) {
      showNotice("Could not load dashboard data. Check Firestore collections and Security Rules. " + error.message, true);
    }
  }

  $("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "Signing in…";
    loginMessage.className = "message";
    try {
      await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value);
    } catch (error) {
      loginMessage.textContent = error.message;
      loginMessage.className = "message error";
    }
  });

  $("logoutBtn").addEventListener("click", () => signOut(auth));
  $("refreshBtn").addEventListener("click", loadDashboard);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      loginView.classList.remove("hidden");
      dashboardView.classList.add("hidden");
      $("logoutBtn").classList.add("hidden");
      return;
    }
    try {
      if (!(await isApprovedAdmin(user))) {
        await signOut(auth);
        loginMessage.textContent = "This account has not been approved as an administrator. Ask the project owner to authorize its UID in Firestore.";
        loginMessage.className = "message error";
        return;
      }
      loginView.classList.add("hidden");
      dashboardView.classList.remove("hidden");
      $("logoutBtn").classList.remove("hidden");
      $("adminEmail").textContent = user.email || "Administrator";
      await checkWorker();
      await loadDashboard();
    } catch (error) {
      await signOut(auth);
      loginMessage.textContent = "Admin verification failed: " + error.message;
      loginMessage.className = "message error";
    }
  });

  checkWorker();
}
