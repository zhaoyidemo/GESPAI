"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Target, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    targetLevel: "5",
    examDate: "2026-03-14",
    weeklyHours: "10",
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLevel: parseInt(formData.targetLevel),
          examDate: formData.examDate,
          weeklyHours: parseInt(formData.weeklyHours),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "设置失败");
      }

      toast({
        title: "设置成功",
        description: "AI 已为你生成专属学习计划",
      });

      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "设置失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">设置学习目标</h1>
        <p className="text-muted-foreground">
          告诉我们你的目标，AI 将为你量身定制学习计划
        </p>
      </div>

      {/* 进度指示器 */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 ${
                  s < step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {step === 1 && <Target className="h-5 w-5" />}
            {step === 2 && <Calendar className="h-5 w-5" />}
            {step === 3 && <Clock className="h-5 w-5" />}
            <span>
              {step === 1 && "选择目标级别"}
              {step === 2 && "设置考试日期"}
              {step === 3 && "安排学习时间"}
            </span>
          </CardTitle>
          <CardDescription>
            {step === 1 && "你想备考 GESP 几级？"}
            {step === 2 && "你计划参加哪一场考试？"}
            {step === 3 && "你每周能投入多少时间学习？"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label>目标级别</Label>
              <Select
                value={formData.targetLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">GESP 1 级（入门）</SelectItem>
                  <SelectItem value="2">GESP 2 级（基础）</SelectItem>
                  <SelectItem value="3">GESP 3 级（初级）</SelectItem>
                  <SelectItem value="4">GESP 4 级（中级）</SelectItem>
                  <SelectItem value="5">GESP 5 级（进阶）</SelectItem>
                  <SelectItem value="6">GESP 6 级（高级）</SelectItem>
                  <SelectItem value="7">GESP 7 级（专业）</SelectItem>
                  <SelectItem value="8">GESP 8 级（精英）</SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  GESP {formData.targetLevel} 级主要内容
                </h4>
                <p className="text-sm text-blue-700">
                  {formData.targetLevel === "5" &&
                    "递归、深度优先搜索（DFS）、广度优先搜索（BFS）、记忆化搜索等"}
                  {formData.targetLevel === "4" &&
                    "排序算法、二分查找、简单数据结构（栈、队列）等"}
                  {formData.targetLevel === "3" &&
                    "数组、字符串处理、简单算法等"}
                  {!["3", "4", "5"].includes(formData.targetLevel) &&
                    "根据级别逐步深入学习编程知识"}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>考试日期</Label>
              <Input
                type="date"
                value={formData.examDate}
                onChange={(e) =>
                  setFormData({ ...formData, examDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-1">
                  2026 年 GESP 考试安排
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 3月14日 - 第一次考试</li>
                  <li>• 6月14日 - 第二次考试</li>
                  <li>• 9月13日 - 第三次考试</li>
                  <li>• 12月13日 - 第四次考试</li>
                </ul>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>每周学习时间（小时）</Label>
              <Select
                value={formData.weeklyHours}
                onValueChange={(value) =>
                  setFormData({ ...formData, weeklyHours: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择时间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 小时（每天约 45 分钟）</SelectItem>
                  <SelectItem value="7">7 小时（每天约 1 小时）</SelectItem>
                  <SelectItem value="10">10 小时（每天约 1.5 小时）</SelectItem>
                  <SelectItem value="14">14 小时（每天约 2 小时）</SelectItem>
                  <SelectItem value="21">21 小时（每天约 3 小时）</SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">学习计划预览</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• 目标：GESP {formData.targetLevel} 级</p>
                  <p>• 考试日期：{formData.examDate}</p>
                  <p>• 每周学习：{formData.weeklyHours} 小时</p>
                  <p className="mt-2 font-medium">
                    AI 将根据以上信息为你制定个性化学习计划
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                上一步
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                下一步
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成计划中...
                  </>
                ) : (
                  <>
                    开始学习
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
