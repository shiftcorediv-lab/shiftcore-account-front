import { showLoading, hideLoading } from "../common/loading.js";
import { getQueryParams, buildCurrentUserFromQuery } from "./query.js";
import {
  monthSelect,
  openMonthlyBtn,
  openRequestBtn,
  downloadCsvBtn,
  refreshTableBtn,
  backToDashboardBtn
} from "./dom.js";
import {
  renderAccountInfo,
  setupShiftCoreEntryBanner,
  renderMonthOptions,
  updateManageState,
  renderEmptyTable,
  renderMonthlyTable,
  showMessage
} from "./ui.js";
import {
  canManagePmo,
  goToDashboard,
  openUrl,
  downloadExcelFile
} from "./navigation.js";
import {
  fetchPmoAdminMeta,
  fetchMonthlyExcel,
  fetchPmoMonthlyTable
} from "./api.js";

const params = getQueryParams();
const currentUser = buildCurrentUserFromQuery(params);
const canManage = canManagePmo(currentUser);

let currentMeta = null;

setupShiftCoreEntryBanner(params);
renderAccountInfo(currentUser);
updateManageState(canManage, currentUser);
renderEmptyTable("対象月を選択すると一覧を表示します。");

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
    updateManageState(true, currentUser);

    if (result.selectedYearMonth) {
      await loadMonthlyTable(result.selectedYearMonth);
    } else {
      renderEmptyTable("表示できる月がありません。");
      showMessage("管理情報を読み込みました", "success");
    }
  } catch (error) {
    console.error(error);
    showMessage("管理情報の取得に失敗しました", "error");
  }
}

async function loadMonthlyTable(targetYearMonth = "") {
  if (!canManage) {
    renderEmptyTable("このアカウントには管理権限がありません。");
    return;
  }

  const selectedYearMonth = String(targetYearMonth || monthSelect.value || "").trim();

  if (!selectedYearMonth) {
    renderEmptyTable("対象月を選択してください。");
    return;
  }

  showMessage("一覧を更新中...");

  try {
    const result = await fetchPmoMonthlyTable(selectedYearMonth, currentUser.role);

    if (!result.success) {
      renderEmptyTable("一覧データの取得に失敗しました。");
      showMessage(result.message || "一覧データの取得に失敗しました", "error");
      return;
    }

    renderMonthlyTable({
      headers: result.headers || [],
      rows: result.rows || []
    });

    showMessage("一覧を更新しました", "success");
  } catch (error) {
    console.error(error);
    renderEmptyTable("一覧データの取得に失敗しました。");
    showMessage("一覧データの取得に失敗しました", "error");
  }
}

monthSelect.addEventListener("change", async () => {
  await loadMonthlyTable(monthSelect.value);
});

refreshTableBtn.addEventListener("click", async () => {
  await loadMonthlyTable(monthSelect.value);
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
  const selectedYearMonth = String(
    (currentMeta && currentMeta.selectedYearMonth) || monthSelect.value || ""
  ).trim();

  if (!selectedYearMonth) {
    showMessage("対象月が選択されていません", "error");
    return;
  }

  showMessage("Excelを生成中...");

  try {
    const result = await fetchMonthlyExcel(selectedYearMonth, currentUser.role);

    if (!result.success) {
      showMessage(result.message || "Excel出力に失敗しました", "error");
      return;
    }

    downloadExcelFile(result.fileName, result.base64Data, result.mimeType);
    showMessage("Excelをダウンロードしました", "success");
  } catch (error) {
    console.error(error);
    showMessage("Excel出力に失敗しました", "error");
  }
});

backToDashboardBtn.addEventListener("click", () => {
  goToDashboard();
});

await loadMeta("");

import { showLoading, hideLoading } from "../common/loading.js";

showLoading("テスト中...");
setTimeout(() => {
  hideLoading();
}, 1500);
