import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 固定のユーザー情報を返す
    const userData = {
      employeeNumber: "123456",
      name: "テストユーザー",
      email: "test@example.com",
      department: "開発部",
      role: "開発者"
    }

    return NextResponse.json({
      success: true,
      data: userData
    })
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました:", error)
    return NextResponse.json(
      {
        success: false,
        error: "ユーザー情報の取得に失敗しました"
      },
      { status: 500 }
    )
  }
}
