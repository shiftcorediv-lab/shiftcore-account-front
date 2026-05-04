import { PMO_ADMIN_API_URL } from "./config.js";

export async function fetchPmoAdminMeta(targetYearMonth, role) {
  const url = new URL(PMO_ADMIN_API_URL);
  url.searchParams.set("action", "getPmoAdminMeta");
  url.searchParams.set("targetYearMonth", targetYearMonth || "");
  url.searchParams.set("role", role || "");

  const response = await fetch(url.toString(), {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("管理情報の取得に失敗しました: " + response.status);
  }

  return await response.json();
}

export async function fetchMonthlyCsv(targetYearMonth, role) {
  const url = new URL(PMO_ADMIN_API_URL);
  url.searchParams.set("action", "exportMonthlyCsv");
  url.searchParams.set("targetYearMonth", targetYearMonth || "");
  url.searchParams.set("role", role || "");

  const response = await fetch(url.toString(), {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("CSV取得に失敗しました: " + response.status);
  }

  return await response.json();
}
