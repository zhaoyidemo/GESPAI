import { test, expect } from "@playwright/test";

test.describe("做题核心流程", () => {
  test("选题 → 编辑代码 → 运行 → 提交 → 查看结果 → 查看历史", async ({ page }) => {
    // 1. 访问题库页面
    await page.goto("/problem");
    await expect(page.getByRole("heading", { name: /题库/ })).toBeVisible();

    // 2. 选择第一道题目进入做题页
    await page.locator("a[href^='/problem/']").first().click();

    // 3. 验证题目页面正确加载
    await expect(page.locator("text=题目")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=返回")).toBeVisible();

    // 4. 验证题目描述 Tab 内容
    await expect(page.locator("text=题目描述")).toBeVisible();

    // 5. 在 Monaco Editor 中输入代码
    // Monaco Editor 需要特殊处理：点击编辑器区域，然后输入
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();

    // 使用键盘全选并替换代码
    await page.keyboard.press("Control+a");
    await page.keyboard.type(
      '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}',
      { delay: 10 }
    );

    // 6. 点击"运行"按钮
    const runButton = page.getByRole("button", { name: /运行/ });
    await runButton.click();

    // 验证进度条出现
    await expect(page.locator("text=正在编译代码")).toBeVisible({ timeout: 5000 });

    // 等待运行完成（最多 30 秒）
    await expect(runButton).toBeEnabled({ timeout: 30000 });

    // 7. 点击"提交"按钮
    const submitButton = page.getByRole("button", { name: /提交/ });
    await submitButton.click();

    // 等待评测完成
    await expect(submitButton).toBeEnabled({ timeout: 30000 });

    // 8. 验证结果 Tab 出现
    const resultTab = page.locator("text=结果").last();
    await expect(resultTab).toBeVisible({ timeout: 5000 });

    // 9. 切换到"提交历史" Tab
    await page.locator("text=提交历史").click();

    // 验证提交记录出现（至少有一条）
    await expect(
      page.locator("text=/\\d+\\/100/").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("题目描述页面包含必要元素", async ({ page }) => {
    // 访问题库，进入第一道题
    await page.goto("/problem");
    await page.locator("a[href^='/problem/']").first().click();

    // 验证关键 UI 元素
    await expect(page.locator("text=返回")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /运行/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /提交/ })).toBeVisible();
    await expect(page.locator("text=题目")).toBeVisible();
    await expect(page.locator("text=AI 帮助")).toBeVisible();
    await expect(page.locator("text=检查清单")).toBeVisible();
    await expect(page.locator("text=代码编辑器")).toBeVisible();
  });

  test("检查清单 Tab 显示 7 项检查", async ({ page }) => {
    await page.goto("/problem");
    await page.locator("a[href^='/problem/']").first().click();

    // 点击检查清单 Tab
    await page.locator("text=检查清单").click();

    // 验证 7 项检查清单
    await expect(page.locator("text=输出格式")).toBeVisible();
    await expect(page.locator("text=变量初始化")).toBeVisible();
    await expect(page.locator("text=越界检查")).toBeVisible();
    await expect(page.locator("text=除零错误")).toBeVisible();
    await expect(page.locator("text=整数溢出")).toBeVisible();
    await expect(page.locator("text=复杂度匹配")).toBeVisible();
    await expect(page.locator("text=边界测试")).toBeVisible();
  });
});
