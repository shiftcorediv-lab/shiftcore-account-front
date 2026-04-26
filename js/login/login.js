import { auth, signOut } from "./auth.js";
import { DASHBOARD_URL } from "./config.js";
import { checkUserWithGas } from "./api.js";
import { saveLoginSession, clearLoginSession } from "./storage.js";
import { setStatus, showLoggedOutState } from "./ui.js";

export async function verifySignedInUser(user) {
  if (!user || !user.email) {
    clearLoginSession();
    showLoggedOutState("未ログイン");
    return;
  }

  try {
    setStatus("アカウント照合中...");

    const loginCheck = await checkUserWithGas(user.email);

    if (loginCheck.ok) {
      saveLoginSession(loginCheck);
      window.location.href = DASHBOARD_URL;
      return;
    }

    clearLoginSession();
    await signOut(auth);
    showLoggedOutState(
      "ログイン不可\n\n" +
      "code: " + loginCheck.code + "\n" +
      "message: " + loginCheck.message
    );
  } catch (error) {
    clearLoginSession();
    showLoggedOutState("エラー\n\n" + error.message);
  }
}
