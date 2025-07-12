import type { User } from "@/app/generated/prisma";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password, name }: User = await request.json();

  try {
    const dbResponse = await db.user.create({
      // lowercase `user`
      data: {
        email,
        password,
        name,
      },
    });

    return new Response(JSON.stringify({ success: true, user: dbResponse }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error In register route", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
