import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, type, size, condition, tags, imageUrl, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const newItem = await db.item.create({
      data: {
        title,
        description,
        category,
        size,
        condition,
        images: [imageUrl], // Store the image URL from UploadThing
        pointValue: 25, // Default value as per schema
        status: "available",
        isApproved: false,
        userId,
      },
    });

    console.log("New item added:", newItem);

    return NextResponse.json({ message: "Item added successfully", item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}