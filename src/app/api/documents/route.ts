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

    const documents = await prisma.savedDocument.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    })

    return NextResponse.json(documents)
  } catch {
    return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await req.json()
    if (!title || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    const doc = await prisma.savedDocument.create({
      data: { title, content, userId: session.user.id },
    })

    return NextResponse.json(doc, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Failed to create document" }, { status: 500 })
  }
}
