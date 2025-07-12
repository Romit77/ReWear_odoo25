// app/shop/item/[id]/page.tsx

import { db } from "../../../../lib/db";
import { notFound } from "next/navigation";
import ProductDetailPage from "../../../../components/PageDetail";
import { Item, User } from "../../../../types/index";

interface ItemPageProps {
  params: {
    id: string;
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = params;

  try {
    // Fetch the specific item
    const item = await db.item.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!item || !item.isApproved || item.status !== "available") {
      notFound();
    }

    // For demo purposes, we'll use a mock current user
    // In a real app, you'd get this from authentication
    const currentUser: User = {
      id: "currentUser",
      name: "John Doe",
      email: "john@example.com",
      points: 75,
      isAdmin: false,
      createdAt: new Date("2023-08-01"),
      updatedAt: new Date("2024-01-20"),
    };

    // Fetch current user's items for swap options
    const userItems = await db.item.findMany({
      where: {
        userId: currentUser.id,
        status: "available",
        isApproved: true,
        id: {
          not: item.id, // Don't include the current item
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the item data to match our Item type
    const transformedItem: Item = {
      id: item.id,
      title: item.title,
      description: item.description ?? undefined,
      category: item.category,
      size: item.size,
      condition: item.condition,
      brand: item.brand ?? undefined,
      images: item.images,
      pointValue: item.pointValue,
      status: item.status,
      isApproved: item.isApproved,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      userId: item.userId,
      user: {
        id: item.user.id,
        name: item.user.name,
        email: item.user.email,
        points: item.user.points,
        isAdmin: item.user.isAdmin,
        createdAt: item.user.createdAt,
        updatedAt: item.user.updatedAt,
      },
    };

    // Transform user items
    const transformedUserItems: Item[] = userItems.map((userItem) => ({
      id: userItem.id,
      title: userItem.title,
      description: userItem.description ?? undefined,
      category: userItem.category,
      size: userItem.size,
      condition: userItem.condition,
      brand: userItem.brand ?? undefined,
      images: userItem.images,
      pointValue: userItem.pointValue,
      status: userItem.status,
      isApproved: userItem.isApproved,
      createdAt: userItem.createdAt,
      updatedAt: userItem.updatedAt,
      userId: userItem.userId,
      user: {
        id: userItem.user.id,
        name: userItem.user.name,
        email: userItem.user.email,
        points: userItem.user.points,
        isAdmin: userItem.user.isAdmin,
        createdAt: userItem.user.createdAt,
        updatedAt: userItem.user.updatedAt,
      },
    }));

    return (
      <ProductDetailPage
        item={transformedItem}
        currentUser={currentUser}
        userItems={transformedUserItems}
      />
    );
  } catch (error) {
    console.error("Error fetching item:", error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ItemPageProps) {
  const { id } = params;

  try {
    const item = await db.item.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        description: true,
        images: true,
      },
    });

    if (!item) {
      return {
        title: "Item Not Found",
      };
    }

    return {
      title: `${item.title} - Shop`,
      description:
        item.description || `Check out this ${item.title} available for swap`,
      openGraph: {
        title: item.title,
        description:
          item.description || `Check out this ${item.title} available for swap`,
        images: item.images.length > 0 ? [item.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Item Not Found",
    };
  }
}
