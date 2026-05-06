import { ACCOUNT_PORTAL_URL, SIGNUP_ADMIN_ALLOWED_ROLES } from "./config.js";

export function canUseSignupAdmin(currentUser) {
  const role = String(currentUser?.role || "").trim().toLowerCase();
  return SIGNUP_ADMIN_ALLOWED_ROLES.includes(role);
}

export function goToAccountPortal() {
  window.location.href = ACCOUNT_PORTAL_URL;
}
