import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const condition = searchParams.get("condition");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "newest";

    // Build where clause
    const where: any = {
      status: "available",
      isApproved: true,
    };

    if (category) {
      where.category = category;
    }

    if (size) {
      where.size = size;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.pointValue = {};
      if (minPrice) where.pointValue.gte = parseInt(minPrice);
      if (maxPrice) where.pointValue.lte = parseInt(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" };

    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { pointValue: "asc" };
        break;
      case "price-high":
        orderBy = { pointValue: "desc" };
        break;
      case "name":
        orderBy = { title: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const items = await db.item.findMany({
      where,
      orderBy,
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
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      size,
      condition,
      brand,
      images,
      pointValue,
      userId,
    } = body;

    // Validate required fields
    if (!title || !category || !size || !condition || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await db.item.create({
      data: {
        title,
        description,
        category,
        size,
        condition,
        brand,
        images: images || [],
        pointValue: pointValue || 25,
        userId,
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
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
