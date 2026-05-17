import { auth, onAuthStateChanged, signOut } from "../login/auth.js";
import { resolveCurrentUserWithGasByIdToken } from "../login/api.js";

function waitForAuthUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user || null);
    });
  });
}

function normalizeResolvedUser(loginCheck, firebaseUser) {
  const src = loginCheck?.user || {};

  return {
    userId: String(src.internal_user_id || src.userId || "").trim(),
    displayName: String(src.name || src.displayName || "").trim(),
    employeeCode: String(src.employee_code || src.employeeCode || "").trim().toUpperCase(),
    role: String(src.role || "").trim().toLowerCase(),
    workStatus: String(src.workStatus || src.work_status || "").trim().toLowerCase(),
    email: String(src.email || firebaseUser?.email || "").trim()
  };
}

export async function resolveAuthenticatedCurrentUser() {
  const firebaseUser = auth.currentUser || await waitForAuthUser();

  if (!firebaseUser || !firebaseUser.email) {
    return {
      ok: false,
      code: "NOT_SIGNED_IN",
      message: "ログインが必要です"
    };
  }

  const idToken = await firebaseUser.getIdToken();
  const loginCheck = await resolveCurrentUserWithGasByIdToken(idToken);

  if (!loginCheck?.ok) {
    return {
      ok: false,
      code: loginCheck?.code || "AUTH_CHECK_FAILED",
      message: loginCheck?.message || "アカウント照合に失敗しました"
    };
  }

  return {
    ok: true,
    user: normalizeResolvedUser(loginCheck, firebaseUser),
    idToken: idToken
  };
}

export async function requireAuthenticatedCurrentUser() {
  const result = await resolveAuthenticatedCurrentUser();

  if (result.ok) {
    return result;
  }

  if (result.code === "NOT_SIGNED_IN" || result.code === "USER_NOT_FOUND") {
    try {
      await signOut(auth);
    } catch (error) {
      // noop
    }
  }

  return result;
}
