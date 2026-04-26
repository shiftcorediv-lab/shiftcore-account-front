export function saveLoginSession(loginCheck) {
  sessionStorage.setItem("shiftcore_user", JSON.stringify(loginCheck.user));
}

export function clearLoginSession() {
  sessionStorage.removeItem("shiftcore_user");
}
