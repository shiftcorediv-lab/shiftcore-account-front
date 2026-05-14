import {
  userNameBox,
  employeeCodeBox,
  accountMetaArea,
  entryBannerArea,
  messageBox,
  requestListArea,
  detailSubmittedAt,
  detailApplicantName,
  detailApplicantEmail,
  detailApplicantType,
  detailCompanyName,
  detailPhone,
  detailNote,
  roleSelect,
  organizationIdInput,
  allowedModulesInput,
  statusSelect,
  workStatusSelect,
  approveBtn,
  rejectBtn
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

export function renderRequestList(requests, onSelect) {
  requestListArea.innerHTML = "";

  if (!Array.isArray(requests) || requests.length === 0) {
    requestListArea.innerHTML = "<div class='request-item'><div class='request-item-header'>申請はありません</div></div>";
    return;
  }

  requests.forEach((request) => {
    const item = document.createElement("div");
    item.className = "request-item";

    const header = document.createElement("div");
    header.className = "request-item-header";
    header.textContent = request.submitted_at || "";

    const sub = document.createElement("div");
    sub.className = "request-item-sub";
    sub.textContent = `${request.applicant_name || ""} / ${request.applicant_email || ""}`;

    const button = document.createElement("button");
    button.className = "open-btn";
    button.type = "button";
    button.textContent = "詳細を見る";
    button.addEventListener("click", () => onSelect(request));

    item.appendChild(header);
    item.appendChild(sub);
    item.appendChild(button);
    requestListArea.appendChild(item);
  });
}

export function renderRequestDetail(request) {
  detailSubmittedAt.textContent = request?.submitted_at || "未選択";
  detailApplicantName.textContent = request?.applicant_name || "未選択";
  detailApplicantEmail.textContent = request?.applicant_email || "未選択";
  detailApplicantType.textContent = request?.applicant_type || "未選択";
  detailCompanyName.textContent = request?.company_name || "";
  detailPhone.textContent = request?.phone || "";
  detailNote.textContent = request?.note || "";
}

export function applyApprovalDefaults(request) {
  const type = String(request?.applicant_type || "").trim();
  const companyName = String(request?.company_name || "").trim();

  if (type === "employee") {
    roleSelect.value = "employee";
    organizationIdInput.value = "another";
    allowedModulesInput.value = "pmo";
    statusSelect.value = "active";
    workStatusSelect.value = "on";
    return;
  }

  if (type === "partner_individual") {
    roleSelect.value = "partner_individual";
    organizationIdInput.value = companyName;
    allowedModulesInput.value = "pmo";
    statusSelect.value = "active";
    workStatusSelect.value = "on";
    return;
  }

  if (type === "partner_company_admin") {
    roleSelect.value = "partner_company_admin";
    organizationIdInput.value = companyName;
    allowedModulesInput.value = "partner_hub";
    statusSelect.value = "active";
    workStatusSelect.value = "on";
    return;
  }

  roleSelect.value = "";
  organizationIdInput.value = "";
  allowedModulesInput.value = "";
  statusSelect.value = "active";
  workStatusSelect.value = "on";
}

export function setActionButtonsEnabled(enabled) {
  approveBtn.disabled = !enabled;
  rejectBtn.disabled = !enabled;
}
