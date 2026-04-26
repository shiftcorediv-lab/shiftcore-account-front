import { MODULE_NAME_MAP } from "./config.js";
import { moduleList } from "./dom.js";
import { openModule } from "./navigation.js";

export function renderModules(modules, setStatus) {
  moduleList.innerHTML = "";

  if (!Array.isArray(modules) || modules.length === 0) {
    moduleList.innerHTML = "<div class='module-card'><div class='module-card-title'>利用可能モジュールなし</div></div>";
    return;
  }

  modules.forEach((moduleCode) => {
    const card = document.createElement("div");
    card.className = "module-card";

    const title = document.createElement("div");
    title.className = "module-card-title";
    title.textContent = MODULE_NAME_MAP[moduleCode] || moduleCode;

    const code = document.createElement("div");
    code.className = "module-card-code";
    code.textContent = "module_code: " + moduleCode;

    const button = document.createElement("button");

    if (moduleCode === "pmo") {
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
