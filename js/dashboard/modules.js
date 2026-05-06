import { MODULE_NAME_MAP } from "./config.js";
import { moduleList } from "./dom.js";
import { openModule } from "./navigation.js";

function canShowModule(moduleCode, user) {
  const role = String(user?.role || "").trim().toLowerCase();

  if (moduleCode === "account") {
    return role === "admin" || role === "developer";
  }

  return true;
}

export function renderModules(modules, user, setStatus) {
  moduleList.innerHTML = "";

  const visibleModules = Array.isArray(modules)
    ? modules.filter((moduleCode) => canShowModule(moduleCode, user))
    : [];

  if (visibleModules.length === 0) {
    moduleList.innerHTML = "<div class='module-card'><div class='module-card-title'>利用可能モジュールなし</div></div>";
    return;
  }

  visibleModules.forEach((moduleCode) => {
    const card = document.createElement("div");
    card.className = "module-card";

    const title = document.createElement("div");
    title.className = "module-card-title";
    title.textContent = MODULE_NAME_MAP[moduleCode] || moduleCode;

    const code = document.createElement("div");
    code.className = "module-card-code";
    code.textContent = "module_code: " + moduleCode;

    const button = document.createElement("button");

    if (moduleCode === "pmo" || moduleCode === "account") {
      button.textContent = "開く";
      button.addEventListener("click", () => openModule(moduleCode, setStatus));
    } else {
      button.textContent = "準備中";
      button.disabled = true;
    }

    card.appendChild(title);
    card.appendChild(code);
    card.appendChild(button);
    moduleList.appendChild(card);
  });
}
