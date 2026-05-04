import { DASHBOARD_URL, MANAGE_ALLOWED_ROLES } from "./config.js";

export function canManagePmo(currentUser) {
  const role = String(currentUser?.role || "").trim().toLowerCase();
  return MANAGE_ALLOWED_ROLES.includes(role);
}

export function goToDashboard() {
  window.location.href = DASHBOARD_URL;
}

export function openUrl(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function downloadCsvFile(fileName, csvText) {
  const bom = "\uFEFF";
  const blob = new Blob([bom, csvText], { type: "text/csv;charset=utf-8;" });
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(blobUrl);
}
