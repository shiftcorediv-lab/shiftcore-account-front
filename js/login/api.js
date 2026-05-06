import { LOGIN_CHECK_URL } from "./config.js";

export async function checkUserWithGas(email) {
  const response = await fetch(LOGIN_CHECK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "checkLoginUserByEmail",
      email: email
    })
  });

  const result = await response.json();
  return result;
}
