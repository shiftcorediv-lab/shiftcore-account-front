import { getQueryParams, buildCurrentUserFromQuery } from "./query.js";
import {
  monthSelect,
  openMonthlyBtn,
  openRequestBtn,
  downloadCsvBtn,
  backToDashboardBtn
} from "./dom.js";
import {
  renderAccountInfo,
  setupShiftCoreEntryBanner,
  renderMonthOptions,
  updateManageState,
  showMessage
} from "./ui.js";
import { canManagePmo, goToDashboard, openUrl, downloadCsvFile } from "./navigation.js";
import { fetchPmoAdminMeta, fetchMonthlyCsv } from "./api.js";

const params = getQueryParams();
const currentUser = buildCurrentUserFromQuery(params);
const canManage = canManagePmo(currentUser);

let currentMeta = null;

setupShiftCoreEntryBanner(params);
renderAccountInfo(currentUser);
updateManageState(canManage);

async function loadMeta(targetYearMonth = "") {
  if (!canManage) {
    showMessage("このアカウントには管理権限がありません", "error");
    return;
  }

  showMessage("管理情報を取得中...");

  try {
    const result = await fetchPmoAdminMeta(targetYearMonth, currentUser.role);

    if (!result.success) {
      showMessage(result.message || "管理情報の取得に失敗しました", "error");
      return;
    }

    currentMeta = result;
    renderMonthOptions(result.months || [], result.selectedYearMonth || "");
    updateManageState(true);

    showMessage("管理情報を読み込みました", "success");
  } catch (error) {
    console.error(error);
    showMessage("管理情報の取得に失敗しました", "error");
  }
}

monthSelect.addEventListener("change", async () => {
  await loadMeta(monthSelect.value);
});

openMonthlyBtn.addEventListener("click", () => {
  if (!currentMeta || !currentMeta.monthlySheetUrl) {
    showMessage("対象月の希望休一覧URLを取得できていません", "error");
    return;
  }

  openUrl(currentMeta.monthlySheetUrl);
});

openRequestBtn.addEventListener("click", () => {
  if (!currentMeta || !currentMeta.requestSheetUrl) {
    showMessage("申請原本URLを取得できていません", "error");
    return;
  }

  openUrl(currentMeta.requestSheetUrl);
});

downloadCsvBtn.addEventListener("click", async () => {
  if (!currentMeta || !currentMeta.selectedYearMonth) {
    showMessage("対象月が選択されていません", "error");
    return;
  }

  showMessage("CSVを生成中...");

  try {
    const result = await fetchMonthlyCsv(currentMeta.selectedYearMonth, currentUser.role);

    if (!result.success) {
      showMessage(result.message || "CSV出力に失敗しました", "error");
      return;
    }

    downloadCsvFile(result.fileName, result.csvText);
    showMessage("CSVをダウンロードしました", "success");
  } catch (error) {
    console.error(error);
    showMessage("CSV出力に失敗しました", "error");
  }
});

backToDashboardBtn.addEventListener("click", () => {
  goToDashboard();
});

await loadMeta("");
