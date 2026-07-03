import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const versions = await prisma.version.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        originalText: true,
        humanizedText: true,
        readability: true,
        wordCount: true,
        createdAt: true,
      },
    })

    return NextResponse.json(versions)
  } catch {
    return NextResponse.json({ message: "Failed to fetch history" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ message: "Missing version ID" }, { status: 400 })
    }

    await prisma.version.deleteMany({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}
