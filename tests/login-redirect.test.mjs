import test from "node:test";
import assert from "node:assert/strict";

import { getPostLoginUrl } from "../js/login/redirect.js";
import { DASHBOARD_URL } from "../js/login/config.js";

test("ログイン後は指定されたShiftCore画面へ戻る", () => {
  const target = "https://shiftcorediv-lab.github.io/shiftcore-suite/apps/ordercase/?case_id=CASE-1";
  const search = "?redirect=" + encodeURIComponent(target);

  assert.equal(getPostLoginUrl(search), target);
});

test("戻り先がない場合はダッシュボードへ進む", () => {
  assert.equal(getPostLoginUrl(""), DASHBOARD_URL);
});

test("外部サイトと壊れたURLには戻らない", () => {
  assert.equal(
    getPostLoginUrl("?redirect=" + encodeURIComponent("https://example.com/")),
    DASHBOARD_URL
  );
  assert.equal(getPostLoginUrl("?redirect=%%%"), DASHBOARD_URL);
});
