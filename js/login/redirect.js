import { DASHBOARD_URL } from "./config.js";

const SUITE_ORIGIN = new URL(DASHBOARD_URL).origin;
const SUITE_APPS_PATH = "/shiftcore-suite/apps/";

/**
 * ログインを要求したShiftCore画面だけへ戻す。
 * 外部サイトを指定された場合は、従来どおりダッシュボードへ進める。
 */
export function getPostLoginUrl(search = window.location.search) {
  const redirect = new URLSearchParams(search).get("redirect");

  if (!redirect) {
    return DASHBOARD_URL;
  }

  try {
    const target = new URL(redirect);

    if (target.origin === SUITE_ORIGIN && target.pathname.startsWith(SUITE_APPS_PATH)) {
      return target.toString();
    }
  } catch (_) {
    // 壊れたURLは通常のダッシュボード遷移として扱う。
  }

  return DASHBOARD_URL;
}
