import {
  operatorText,
  permissionBadge,
  currentUserPermissionText,
  visibleCountText,
  totalCountText,
  statusSummaryText,
  userTableBody,
  editorTitle,
  selectedUserIdText,
  internalUserIdInput,
  nameInput,
  displayNameInput,
  employeeCodeInput,
  emailInput,
  phoneInput,
  roleInput,
  organizationInput,
  departmentInput,
  positionInput,
  baseAreaInput,
  statusInput,
  workStatusInput,
  sortOrderInput,
  ordercasePermissionInput,
  memoInput,
  authProviderText,
  authUidText,
  createdAtText,
  updatedAtText,
  updatedByText,
  logsList,
  statusBox
} from "./dom.js";

// ===== 状態表示ここから =====
export function setStatus(message) {
  statusBox.textContent = message;
}

export function setOperator(user) {
  operatorText.textContent = `${user.name || "-"} / ${user.email || "-"}`;
  permissionBadge.textContent = "Account Console 使用可";
  permissionBadge.className = "badge ok";
}

export function setPermissionError(message) {
  permissionBadge.textContent = "権限なし";
  permissionBadge.className = "badge ng";
  operatorText.textContent = message;

  if (currentUserPermissionText) {
    currentUserPermissionText.textContent = "-";
  }
}

export function renderCurrentUserPermission(user) {
  if (!currentUserPermissionText) {
    return;
  }

  const modules = modulesText(user.allowed_modules);
  const ordercasePermission = text(user.ordercase_permission) || "なし";

  currentUserPermissionText.textContent =
    `role: ${text(user.role) || "-"} / status: ${text(user.status) || "-"} / allowed_modules: ${modules || "-"} / OrderCase: ${ordercasePermission}`;
}
// ===== 状態表示ここまで =====


// ===== テキスト整形ここから =====
function text(value) {
  return String(value == null ? "" : value).trim();
}

function modulesText(value) {
  return text(value)
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .join(", ");
}

function makeTd(value) {
  const td = document.createElement("td");
  td.textContent = text(value) || "-";
  return td;
}
// ===== テキスト整形ここまで =====


// ===== ユーザー絞り込みここから =====
export function filterUsers(users, keyword) {
  const q = text(keyword).toLowerCase();

  if (!q) {
    return users;
  }

  return users.filter((user) => {
    const haystack = [
      user.name,
      user.display_name,
      user.employee_code,
      user.email,
      user.phone,
      user.role,
      user.organization_id,
      user.department,
      user.position,
      user.base_area,
      user.status,
      user.allowed_modules,
      user.ordercase_permission,
      user.memo
    ].map((value) => text(value).toLowerCase()).join(" ");

    return haystack.includes(q);
  });
}
// ===== ユーザー絞り込みここまで =====


// ===== ユーザー一覧描画ここから =====
export function renderUsers(users, selectedUserId, onSelectUser) {
  userTableBody.innerHTML = "";

  if (!users.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 10;
    td.textContent = "表示できるユーザーがいません";
    tr.appendChild(td);
    userTableBody.appendChild(tr);
    return;
  }

  users.forEach((user) => {
    const tr = document.createElement("tr");

    if (text(user.internal_user_id) === text(selectedUserId)) {
      tr.classList.add("selected");
    }

    tr.appendChild(makeTd(user.name));
    tr.appendChild(makeTd(user.display_name));
    tr.appendChild(makeTd(user.employee_code));
    tr.appendChild(makeTd(user.email));
    tr.appendChild(makeTd(user.department));
    tr.appendChild(makeTd(user.position));
    tr.appendChild(makeTd(user.base_area));

    const statusTd = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = "status-pill " + text(user.status).toLowerCase();
    pill.textContent = text(user.status) || "-";
    statusTd.appendChild(pill);
    tr.appendChild(statusTd);

    tr.appendChild(makeTd(modulesText(user.allowed_modules)));
    tr.appendChild(makeTd(user.ordercase_permission));

    tr.addEventListener("click", () => onSelectUser(user));
    userTableBody.appendChild(tr);
  });
}
// ===== ユーザー一覧描画ここまで =====


// ===== 集計表示ここから =====
export function renderSummary(filteredUsers, allUsers) {
  visibleCountText.textContent = String(filteredUsers.length);
  totalCountText.textContent = String(allUsers.length);

  const activeCount = allUsers.filter((user) => text(user.status) === "active").length;
  const inactiveCount = allUsers.filter((user) => text(user.status) === "inactive").length;

  statusSummaryText.textContent = `active ${activeCount} / inactive ${inactiveCount}`;
}
// ===== 集計表示ここまで =====


// ===== フォーム操作ここから =====
export function clearUserForm() {
  editorTitle.textContent = "ユーザー追加";
  selectedUserIdText.textContent = "新規作成";

  internalUserIdInput.value = "";
  nameInput.value = "";
  displayNameInput.value = "";
  employeeCodeInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  roleInput.value = "member";
  organizationInput.value = "";
  departmentInput.value = "";
  positionInput.value = "";
  baseAreaInput.value = "";
  statusInput.value = "active";
  workStatusInput.value = "off";
  sortOrderInput.value = "";
  ordercasePermissionInput.value = "";
  memoInput.value = "";

  document.querySelectorAll("input[name='module']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  authProviderText.textContent = "-";
  authUidText.textContent = "-";
  createdAtText.textContent = "-";
  updatedAtText.textContent = "-";
  updatedByText.textContent = "-";
}

export function fillUserForm(user) {
  editorTitle.textContent = "ユーザー編集";
  selectedUserIdText.textContent = text(user.internal_user_id) || "IDなし";

  internalUserIdInput.value = text(user.internal_user_id);
  nameInput.value = text(user.name);
  displayNameInput.value = text(user.display_name);
  employeeCodeInput.value = text(user.employee_code);
  emailInput.value = text(user.email);
  phoneInput.value = text(user.phone);
  roleInput.value = text(user.role) || "member";
  organizationInput.value = text(user.organization_id);
  departmentInput.value = text(user.department);
  positionInput.value = text(user.position);
  baseAreaInput.value = text(user.base_area);
  statusInput.value = text(user.status) || "active";
  workStatusInput.value = text(user.workStatus) || "off";
  sortOrderInput.value = text(user.sortOrder);
  ordercasePermissionInput.value = text(user.ordercase_permission);
  memoInput.value = text(user.memo);

  const modules = text(user.allowed_modules)
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  document.querySelectorAll("input[name='module']").forEach((checkbox) => {
    checkbox.checked = modules.includes(checkbox.value);
  });

  authProviderText.textContent = text(user.auth_provider) || "-";
  authUidText.textContent = text(user.auth_uid) || "-";
  createdAtText.textContent = text(user.created_at) || "-";
  updatedAtText.textContent = text(user.updated_at) || "-";
  updatedByText.textContent = text(user.updated_by) || "-";
}

export function collectUserForm() {
  const modules = Array.from(document.querySelectorAll("input[name='module']:checked"))
    .map((checkbox) => checkbox.value);

  return {
    internal_user_id: text(internalUserIdInput.value),
    name: text(nameInput.value),
    display_name: text(displayNameInput.value),
    employee_code: text(employeeCodeInput.value),
    email: text(emailInput.value),
    phone: text(phoneInput.value),
    role: text(roleInput.value),
    organization_id: text(organizationInput.value),
    department: text(departmentInput.value),
    position: text(positionInput.value),
    base_area: text(baseAreaInput.value),
    status: text(statusInput.value),
    workStatus: text(workStatusInput.value),
    sortOrder: text(sortOrderInput.value),
    allowed_modules: modules.join(","),
    ordercase_permission: text(ordercasePermissionInput.value),
    memo: text(memoInput.value)
  };
}
// ===== フォーム操作ここまで =====


// ===== 変更履歴描画ここから =====
export function renderLogs(logs) {
  logsList.innerHTML = "";

  if (!logs.length) {
    logsList.textContent = "変更履歴はありません";
    return;
  }

  logs.forEach((log) => {
    const item = document.createElement("div");
    item.className = "log-item";

    const meta = document.createElement("div");
    meta.className = "log-meta";
    meta.textContent = `${log.changed_at || "-"} / ${log.changed_by || "-"} / ${log.target_email || "-"}`;

    const body = document.createElement("div");
    body.textContent = `${log.field || "-"}：${log.before_value || ""} → ${log.after_value || ""}`;

    const memo = document.createElement("div");
    memo.className = "log-meta";
    memo.textContent = log.memo || "";

    item.appendChild(meta);
    item.appendChild(body);
    item.appendChild(memo);

    logsList.appendChild(item);
  });
}
// ===== 変更履歴描画ここまで =====
