import { auth, signOut } from "./auth.js";
import { DASHBOARD_URL, SIGNUP_REQUEST_URL } from "./config.js";
import { resolveCurrentUserWithGasByIdToken } from "./api.js?v=20260806-idtoken-1";
import { saveLoginSession, clearLoginSession, saveSignupEmail, clearSignupEmail } from "./storage.js";
import { setStatus, showLoggedOutState } from "./ui.js";
import { getPostLoginUrl } from "./redirect.js?v=20260806-login-return-1";

let verificationPromise = null;

export async function verifySignedInUser(user) {
  if (verificationPromise) {
    return verificationPromise;
  }

  verificationPromise = verifySignedInUser_(user);

  try {
    return await verificationPromise;
  } finally {
    verificationPromise = null;
  }
}

async function verifySignedInUser_(user) {
  if (!user || !user.email) {
    clearLoginSession();
    clearSignupEmail();
    showLoggedOutState("未ログイン");
    return;
  }

  try {
    setStatus("アカウント照合中...");

    const idToken = await user.getIdToken();
    const loginCheck = await resolveCurrentUserWithGasByIdToken(idToken);

    if (loginCheck.ok) {
      clearSignupEmail();
      saveLoginSession(loginCheck);
      window.location.href = getPostLoginUrl();
      return;
    }

    if (loginCheck.code === "USER_NOT_FOUND") {
      clearLoginSession();
      saveSignupEmail(user.email);
      window.location.href = SIGNUP_REQUEST_URL;
      return;
    }

    clearLoginSession();
    clearSignupEmail();
    await signOut(auth);
    showLoggedOutState(
      "ログイン不可\n\n" +
      "code: " + loginCheck.code + "\n" +
      "message: " + loginCheck.message
    );
  } catch (error) {
    clearLoginSession();
    clearSignupEmail();
    showLoggedOutState("エラー\n\n" + error.message);
  }
}
