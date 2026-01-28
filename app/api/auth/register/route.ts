import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  email: z.string().email("请输入有效的邮箱地址").optional().or(z.literal("")),
  password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = validationResult.data;

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "用户名已被使用" }, { status: 400 });
    }

    // 检查邮箱是否已存在
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json({ error: "邮箱已被注册" }, { status: 400 });
      }
    }

    // 创建用户
    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        passwordHash,
        targetLevel: 5,
        streakDays: 0,
        totalXp: 0,
        badges: [],
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
