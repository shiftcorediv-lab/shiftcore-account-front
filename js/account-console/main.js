import { DASHBOARD_URL, SIGNUP_ADMIN_URL } from "./config.js";
import { requireAccountConsoleSession } from "./auth.js";
import {
  getCurrentAccountConsoleUser,
  listAccountUsers,
  createAccountUser,
  updateAccountUser,
  getAccountLogs
} from "./api.js";
import {
  dashboardBtn,
  signupAdminBtn,
  reloadBtn,
  newUserBtn,
  searchInput,
  userForm,
  clearFormBtn,
  loadLogsBtn,
  saveUserBtn
} from "./dom.js";
import {
  setStatus,
  setOperator,
  setPermissionError,
  renderCurrentUserPermission,
  filterUsers,
  renderUsers,
  renderSummary,
  clearUserForm,
  fillUserForm,
  collectUserForm,
  renderLogs
} from "./ui.js";

// ===== 状態ここから =====
let session = null;
let idToken = "";
let allUsers = [];
let selectedUser = null;
let currentUser = null;
// ===== 状態ここまで =====


// ===== 初期化ここから =====
async function init() {
  try {
    setStatus("ログイン状態を確認中...");

    session = await requireAccountConsoleSession();

    if (!session) {
      return;
    }

    idToken = session.idToken;

    setStatus("Account Console権限を確認中...");

    const currentResult = await getCurrentAccountConsoleUser(idToken);

    if (!currentResult.ok) {
      setPermissionError(currentResult.message || "Account Consoleの利用権限がありません");
      setStatus(JSON.stringify(currentResult, null, 2));
      return;
    }

    setOperator(currentResult.user);
    renderCurrentUserPermission(currentResult.user);
    currentUser = currentResult.user;

    await loadUsers();
    await loadLogs();

    clearUserForm();
    setStatus("Account Consoleを読み込みました");

  } catch (error) {
    setPermissionError(error.message);
    setStatus("初期化エラー\n\n" + error.message);
  }
}
// ===== 初期化ここまで =====


// ===== ユーザー一覧読み込みここから =====
async function loadUsers() {
  setStatus("ユーザー名簿を取得中...");

  const result = await listAccountUsers(idToken);

  if (!result.ok) {
    throw new Error(result.message || "ユーザー一覧の取得に失敗しました");
  }

  allUsers = Array.isArray(result.users) ? result.users : [];

  renderCurrentUsers();
  setStatus("ユーザー名簿を取得しました");
}

function renderCurrentUsers() {
  const filtered = filterUsers(allUsers, searchInput.value);
  const selectedId = selectedUser ? selectedUser.internal_user_id : "";

  renderUsers(filtered, selectedId, (user) => {
    selectedUser = user;
    fillUserForm(user);
    renderCurrentUsers();
    loadLogsForSelectedUser();
  });

  renderSummary(filtered, allUsers);
}
// ===== ユーザー一覧読み込みここまで =====


// ===== 保存ここから =====
async function saveUser(event) {
  event.preventDefault();

  try {
    saveUserBtn.disabled = true;
    setStatus("保存中...");

    const user = collectUserForm();

    if (!user.name) {
      throw new Error("氏名を入力してください");
    }

    if (!user.email) {
      throw new Error("メールを入力してください");
    }

    let result;

    if (user.internal_user_id) {
      result = await updateAccountUser(idToken, user);
    } else {
      result = await createAccountUser(idToken, user);
    }

    if (!result.ok) {
      throw new Error(result.message || "保存に失敗しました");
    }

    selectedUser = result.user || null;

    await loadUsers();
    await loadLogsForSelectedUser();

    if (selectedUser) {
      fillUserForm(selectedUser);
    }

    setStatus(result.message || "保存しました");

  } catch (error) {
    setStatus("保存エラー\n\n" + error.message);
  } finally {
    saveUserBtn.disabled = false;
  }
}
// ===== 保存ここまで =====


// ===== 履歴ここから =====
async function loadLogs() {
  const result = await getAccountLogs(idToken, "");

  if (!result.ok) {
    throw new Error(result.message || "変更履歴の取得に失敗しました");
  }

  renderLogs(Array.isArray(result.logs) ? result.logs : []);
}

async function loadLogsForSelectedUser() {
  if (!selectedUser || !selectedUser.internal_user_id) {
    await loadLogs();
    return;
  }

  const result = await getAccountLogs(idToken, selectedUser.internal_user_id);

  if (!result.ok) {
    throw new Error(result.message || "変更履歴の取得に失敗しました");
  }

  renderLogs(Array.isArray(result.logs) ? result.logs : []);
}
// ===== 履歴ここまで =====


// ===== イベントここから =====
dashboardBtn.addEventListener("click", () => {
  window.location.href = DASHBOARD_URL;
});

signupAdminBtn.addEventListener("click", () => {
  window.location.href = SIGNUP_ADMIN_URL;
});

reloadBtn.addEventListener("click", async () => {
  try {
    await loadUsers();
    await loadLogsForSelectedUser();
  } catch (error) {
    setStatus("再読み込みエラー\n\n" + error.message);
  }
});

newUserBtn.addEventListener("click", () => {
  selectedUser = null;
  clearUserForm();
  renderCurrentUsers();
  loadLogs();
});

clearFormBtn.addEventListener("click", () => {
  selectedUser = null;
  clearUserForm();
  renderCurrentUsers();
});

searchInput.addEventListener("input", () => {
  renderCurrentUsers();
});

userForm.addEventListener("submit", saveUser);

loadLogsBtn.addEventListener("click", async () => {
  try {
    await loadLogsForSelectedUser();
    setStatus("変更履歴を更新しました");
  } catch (error) {
    setStatus("履歴取得エラー\n\n" + error.message);
  }
});
// ===== イベントここまで =====


init();
