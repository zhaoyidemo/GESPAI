import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate", async ({ page }) => {
  // 访问登录页面
  await page.goto("/login");

  // 填写登录表单（使用测试账号）
  await page.getByPlaceholder("用户名").fill(process.env.TEST_USERNAME || "testuser");
  await page.getByPlaceholder("密码").fill(process.env.TEST_PASSWORD || "testpassword");

  // 点击登录按钮
  await page.getByRole("button", { name: "登录" }).click();

  // 等待跳转到主页，确认登录成功
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });

  // 保存认证状态
  await page.context().storageState({ path: authFile });
});
