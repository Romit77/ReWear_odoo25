import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch all pending items for admin approval
export async function GET() {
  try {
    const pendingItems = await db.item.findMany({
      where: {
        isApproved: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ items: pendingItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending items:", error);
    return NextResponse.json({ error: "Failed to fetch pending items" }, { status: 500 });
  }
}

// PUT: Update item approval status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { itemId, isApproved } = body;

    if (!itemId || typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: "Item ID and approval status are required" }, { status: 400 });
    }

    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        isApproved,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      message: `Item ${isApproved ? 'approved' : 'rejected'} successfully`, 
      item: updatedItem 
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating item approval:", error);
    return NextResponse.json({ error: "Failed to update item approval" }, { status: 500 });
  }
}