import {
  userNameBox,
  employeeCodeBox,
  accountMetaArea,
  entryBannerArea,
  monthSelect,
  monthHint,
  manageHint,
  messageBox,
  openMonthlyBtn,
  openRequestBtn,
  downloadCsvBtn
} from "./dom.js";

export function setInfoBox(target, text, type = "") {
  target.textContent = text;
  target.className = "info-box";
  if (type) target.classList.add(type);
}

export function showMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = "message";
  if (type) messageBox.classList.add(type);
}

export function renderAccountInfo(currentUser) {
  setInfoBox(
    userNameBox,
    currentUser.displayName || "ユーザー情報を取得できませんでした",
    currentUser.displayName ? "success" : "error"
  );

  setInfoBox(
    employeeCodeBox,
    currentUser.employeeCode || "社員コードを取得できませんでした",
    currentUser.employeeCode ? "success" : "error"
  );

  accountMetaArea.innerHTML = "";

  const roleBadge = document.createElement("span");
  roleBadge.className = "badge";
  roleBadge.textContent = "role: " + (currentUser.role || "未設定");

  const workStatusBadge = document.createElement("span");
  workStatusBadge.className = "badge";
  workStatusBadge.textContent = "workStatus: " + (currentUser.workStatus || "未設定");

  accountMetaArea.appendChild(roleBadge);
  accountMetaArea.appendChild(workStatusBadge);
}

export function setupShiftCoreEntryBanner(params) {
  if ((params.from || "") !== "shiftcore") return;

  const banner = document.createElement("div");
  banner.style.margin = "0 auto 16px";
  banner.style.padding = "12px 14px";
  banner.style.borderRadius = "12px";
  banner.style.background = "#eef3ff";
  banner.style.border = "1px solid #cfdcff";
  banner.style.fontSize = "14px";
  banner.style.lineHeight = "1.6";
  banner.innerHTML = `
    <div><strong>ShiftCoreから移動しました</strong></div>
    <div>module: ${params.module || "unknown"}</div>
  `;
  entryBannerArea.appendChild(banner);
}

export function renderMonthOptions(months, selectedYearMonth) {
  monthSelect.innerHTML = "";

  if (!Array.isArray(months) || months.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "利用可能な月がありません";
    monthSelect.appendChild(option);
    monthSelect.disabled = true;
    monthHint.textContent = "希望休一覧シートがまだありません。";
    return;
  }

  monthSelect.disabled = false;
  monthHint.textContent = "存在する月のみ選択できます。";

  months.forEach((ym) => {
    const option = document.createElement("option");
    option.value = ym;
    option.textContent = ym;
    if (ym === selectedYearMonth) {
      option.selected = true;
    }
    monthSelect.appendChild(option);
  });
}

export function updateManageState(canManage) {
  openMonthlyBtn.disabled = !canManage;
  openRequestBtn.disabled = !canManage;
  downloadCsvBtn.disabled = !canManage;
  monthSelect.disabled = !canManage || monthSelect.disabled;

  manageHint.textContent = canManage
    ? "対象月を選択して操作できます。"
    : "このアカウントには管理権限がありません。";
}
