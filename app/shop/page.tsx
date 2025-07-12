import { db } from "../../lib/db";
import ShopPage from "@/components/ShopPage";
import { Item } from "../../types/index";

export default async function Shop() {
  // Fetch initial items on the server
  const items = await db.item.findMany({
    where: {
      status: "available",
      isApproved: true,
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

  // Transform the data to match our Item type
  const transformedItems: Item[] = items.map((item) => ({
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
  }));

  return <ShopPage initialItems={transformedItems} />;
}
