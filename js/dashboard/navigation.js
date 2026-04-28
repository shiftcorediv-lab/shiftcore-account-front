import { LOGIN_PAGE_URL, PMO_V2_URL } from "./config.js";
import { getStoredUser } from "./storage.js";

const PMO_PORTAL_URL = "./pmo-portal.html";
const PMO_PORTAL_ROLES = ["admin", "developer"];

export function goToLogin() {
  window.location.href = LOGIN_PAGE_URL;
}

export function buildPmoFallbackUrl(storedUser) {
  const targetUrl = new URL(PMO_V2_URL);

  targetUrl.searchParams.set("from", "shiftcore");
  targetUrl.searchParams.set("module", "pmo");
  targetUrl.searchParams.set("userId", storedUser.userId || storedUser.internal_user_id || "");
  targetUrl.searchParams.set("displayName", storedUser.displayName || storedUser.name || "");
  targetUrl.searchParams.set("employeeCode", storedUser.employeeCode || storedUser.employee_code || "");
  targetUrl.searchParams.set("role", storedUser.role || "");
  targetUrl.searchParams.set("workStatus", storedUser.workStatus || storedUser.work_status || "");

  return targetUrl.toString();
}

export function buildPmoPortalUrl(storedUser) {
  const targetUrl = new URL(PMO_PORTAL_URL, window.location.href);

  targetUrl.searchParams.set("from", "shiftcore");
  targetUrl.searchParams.set("module", "pmo");
  targetUrl.searchParams.set("userId", storedUser.userId || storedUser.internal_user_id || "");
  targetUrl.searchParams.set("displayName", storedUser.displayName || storedUser.name || "");
  targetUrl.searchParams.set("employeeCode", storedUser.employeeCode || storedUser.employee_code || "");
  targetUrl.searchParams.set("role", storedUser.role || "");
  targetUrl.searchParams.set("workStatus", storedUser.workStatus || storedUser.work_status || "");

  return targetUrl.toString();
}

function shouldUsePmoPortal(storedUser) {
  const role = String(storedUser?.role || "").trim().toLowerCase();
  return PMO_PORTAL_ROLES.includes(role);
}

export function openModule(moduleCode, setStatus) {
  const storedUser = getStoredUser();

  if (moduleCode === "pmo") {
    if (!storedUser) {
      setStatus("ユーザー情報がありません");
      return;
    }

    if (shouldUsePmoPortal(storedUser)) {
      window.location.href = buildPmoPortalUrl(storedUser);
      return;
    }

    if (storedUser.pmoV2Url) {
      window.location.href = storedUser.pmoV2Url;
      return;
    }

    window.location.href = buildPmoFallbackUrl(storedUser);
    return;
  }

  setStatus("このモジュールはまだ接続されていません: " + moduleCode);
}
