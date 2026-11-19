const input = document.getElementById("workerUrl");
const result = document.getElementById("result");
const status = document.getElementById("apiStatus");
const message = document.getElementById("apiMessage");
input.value = window.SKY_CONFIG?.workerUrl || "";
document.getElementById("testBtn").addEventListener("click", async () => {
  const base = input.value.trim().replace(/\/+$/, "");
  if (!base) { result.textContent = "Enter your Worker URL first."; return; }
  result.textContent = "Checking…";
  try {
    const response = await fetch(`${base}/api/health`);
    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    status.textContent = "Online";
    message.textContent = data.app || "Worker responding";
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    status.textContent = "Connection failed";
    message.textContent = "Check the Worker URL and deployment.";
    result.textContent = error.message;
  }
});
