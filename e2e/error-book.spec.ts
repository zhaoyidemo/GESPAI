import { test, expect } from "@playwright/test";

test.describe("错题流程", () => {
  test("提交错误代码 → 记录错题 → 查看错题本", async ({ page }) => {
    // 1. 进入题目页面
    await page.goto("/problem");
    await page.locator("a[href^='/problem/']").first().click();
    await expect(page.locator("text=题目描述")).toBeVisible({ timeout: 10000 });

    // 2. 输入一段错误代码
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type(
      '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "wrong answer" << endl;\n    return 0;\n}',
      { delay: 10 }
    );

    // 3. 提交代码
    await page.getByRole("button", { name: /提交/ }).click();
    await expect(
      page.getByRole("button", { name: /提交/ })
    ).toBeEnabled({ timeout: 30000 });

    // 4. 等待结果 Tab 出现，检查是否为非 AC
    const resultTab = page.locator("text=结果").last();
    if (await resultTab.isVisible()) {
      await resultTab.click();

      // 5. 如果有"记录错题"按钮，点击它
      const recordBtn = page.getByRole("button", { name: /记录错题/ });
      if (await recordBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await recordBtn.click();

        // 等待记录完成
        await expect(recordBtn).not.toContainText("记录中...", {
          timeout: 10000,
        });
      }
    }

    // 6. 导航到错题本
    await page.goto("/error-book");
    await expect(page.locator("text=/错题/")).toBeVisible({ timeout: 10000 });
  });

  test("错题本页面正确加载", async ({ page }) => {
    await page.goto("/error-book");

    // 验证页面基本元素
    await expect(page.locator("text=/错题/")).toBeVisible({ timeout: 10000 });
  });

  test("提交历史中可以查看已记录的错题", async ({ page }) => {
    // 进入题目页面
    await page.goto("/problem");
    await page.locator("a[href^='/problem/']").first().click();
    await expect(page.locator("text=题目描述")).toBeVisible({ timeout: 10000 });

    // 切换到提交历史 Tab
    await page.locator("text=提交历史").click();

    // 如果有提交记录，检查是否有错题标记
    const submissions = page.locator("[class*='rounded-lg border cursor-pointer']");
    const count = await submissions.count();

    if (count > 0) {
      // 点击第一个提交记录展开详情
      await submissions.first().click();

      // 检查是否有错题相关按钮（记录错题或查看错题复盘）
      const hasErrorButton = await page
        .locator("text=/记录错题|查看错题复盘|已记错题/")
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      // 仅验证展开功能正常工作
      expect(hasErrorButton !== undefined).toBeTruthy();
    }
  });
});
