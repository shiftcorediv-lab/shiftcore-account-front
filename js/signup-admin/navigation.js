import { ACCOUNT_PORTAL_URL, SIGNUP_ADMIN_ALLOWED_ROLES } from "./config.js";

export function canUseSignupAdmin(currentUser) {
  const role = String(currentUser?.role || "").trim().toLowerCase();
  return SIGNUP_ADMIN_ALLOWED_ROLES.includes(role);
}

export function buildAccountPortalUrl(currentUser) {
  const targetUrl = new URL(ACCOUNT_PORTAL_URL, window.location.href);

  targetUrl.searchParams.set("from", "shiftcore");
  targetUrl.searchParams.set("module", "account");
  targetUrl.searchParams.set("userId", currentUser.userId || "");
  targetUrl.searchParams.set("displayName", currentUser.displayName || "");
  targetUrl.searchParams.set("employeeCode", currentUser.employeeCode || "");
  targetUrl.searchParams.set("role", currentUser.role || "");
  targetUrl.searchParams.set("workStatus", currentUser.workStatus || "");

  return targetUrl.toString();
}

export function goToAccountPortal(currentUser) {
  window.location.href = buildAccountPortalUrl(currentUser);
}
