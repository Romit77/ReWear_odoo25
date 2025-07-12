const { PrismaClient } = require("../app/generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const categories = [
  "clothing",
  "electronics",
  "books",
  "home-decor",
  "sports",
  "toys",
  "accessories",
  "furniture",
  "beauty",
  "automotive",
];

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
  "Small",
  "Medium",
  "Large",
];
const conditions = ["new", "like-new", "good", "fair", "poor"];
const brands = [
  "Nike",
  "Adidas",
  "Apple",
  "Samsung",
  "Sony",
  "IKEA",
  "Zara",
  "H&M",
  "Uniqlo",
  "Amazon",
  "Target",
  "Walmart",
  "Best Buy",
  "Costco",
  "Generic",
];

const clothingItems = [
  "T-Shirt",
  "Jeans",
  "Sneakers",
  "Jacket",
  "Dress",
  "Sweater",
  "Hoodie",
  "Shorts",
  "Skirt",
  "Blouse",
  "Pants",
  "Boots",
  "Sandals",
  "Hat",
  "Scarf",
];

const electronicsItems = [
  "iPhone",
  "Samsung Galaxy",
  "iPad",
  "MacBook",
  "Gaming Console",
  "Headphones",
  "Smart Watch",
  "Tablet",
  "Laptop",
  "Speaker",
  "Camera",
];

const booksItems = [
  "Fiction Novel",
  "Non-Fiction Book",
  "Textbook",
  "Cookbook",
  "Biography",
  "Self-Help Book",
  "Children's Book",
  "Art Book",
  "Travel Guide",
  "Dictionary",
];

const homeDecorItems = [
  "Vase",
  "Picture Frame",
  "Candle",
  "Pillow",
  "Throw Blanket",
  "Wall Art",
  "Plant Pot",
  "Mirror",
  "Lamp",
  "Decorative Bowl",
];

const sportsItems = [
  "Basketball",
  "Soccer Ball",
  "Tennis Racket",
  "Yoga Mat",
  "Dumbbell",
  "Bicycle",
  "Skateboard",
  "Running Shoes",
  "Golf Club",
  "Swimming Goggles",
];

const toysItems = [
  "Action Figure",
  "Board Game",
  "Puzzle",
  "Stuffed Animal",
  "Building Blocks",
  "Doll",
  "Remote Control Car",
  "Educational Toy",
  "Art Supplies",
  "Musical Instrument",
];

const accessoriesItems = [
  "Watch",
  "Sunglasses",
  "Jewelry",
  "Bag",
  "Wallet",
  "Belt",
  "Keychain",
  "Phone Case",
  "Earrings",
  "Bracelet",
  "Necklace",
  "Ring",
];

const furnitureItems = [
  "Chair",
  "Table",
  "Sofa",
  "Bed",
  "Dresser",
  "Bookshelf",
  "Desk",
  "Wardrobe",
  "Coffee Table",
  "Dining Set",
  "Ottoman",
  "Cabinet",
];

const beautyItems = [
  "Makeup Palette",
  "Skincare Set",
  "Perfume",
  "Hair Styling Tool",
  "Nail Polish",
  "Lipstick",
  "Foundation",
  "Moisturizer",
  "Shampoo",
  "Conditioner",
];

const automotiveItems = [
  "Car Phone Mount",
  "Car Charger",
  "Seat Covers",
  "Floor Mats",
  "Air Freshener",
  "Tire Gauge",
  "Jump Starter",
  "Car Vacuum",
  "Dashboard Cam",
  "GPS",
];

const categoryItemsMap = {
  clothing: clothingItems,
  electronics: electronicsItems,
  books: booksItems,
  "home-decor": homeDecorItems,
  sports: sportsItems,
  toys: toysItems,
  accessories: accessoriesItems,
  furniture: furnitureItems,
  beauty: beautyItems,
  automotive: automotiveItems,
};

function getRandomItems(category) {
  const items = categoryItemsMap[category];
  return faker.helpers.arrayElement(items);
}

function generateDescription(title, category, condition, brand) {
  const descriptions = [
    `High-quality ${title.toLowerCase()} in ${condition} condition.`,
    `Perfect ${title.toLowerCase()} for everyday use.`,
    `Excellent ${title.toLowerCase()} from ${brand || "a trusted brand"}.`,
    `Great ${title.toLowerCase()} for ${category} enthusiasts.`,
    `Well-maintained ${title.toLowerCase()} ready for a new owner.`,
    `Stylish ${title.toLowerCase()} perfect for any occasion.`,
    `Durable ${title.toLowerCase()} with plenty of life left.`,
    `Beautiful ${title.toLowerCase()} in ${condition} condition.`,
  ];

  return faker.helpers.arrayElement(descriptions);
}

function generateImages(category) {
  const imageCount = faker.number.int({ min: 1, max: 4 });
  const images: string[] = [];

  for (let i = 0; i < imageCount; i++) {
    images.push(
      `https://picsum.photos/400/300?random=${faker.number.int({
        min: 1,
        max: 1000,
      })}`
    );
  }

  return images;
}

function getPointValueByCategory(category) {
  const pointRanges = {
    electronics: { min: 50, max: 500 },
    furniture: { min: 30, max: 200 },
    clothing: { min: 10, max: 100 },
    books: { min: 5, max: 50 },
    "home-decor": { min: 15, max: 80 },
    sports: { min: 20, max: 150 },
    toys: { min: 10, max: 80 },
    accessories: { min: 15, max: 120 },
    beauty: { min: 10, max: 100 },
    automotive: { min: 20, max: 150 },
  };

  const range = pointRanges[category] || { min: 10, max: 100 };
  return faker.number.int({ min: range.min, max: range.max });
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.swap.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  console.log("👥 Creating users...");
  const users: any[] = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: "hashedpassword123",
        points: faker.number.int({ min: 0, max: 500 }),
        isAdmin: i === 0 ? true : false,
      },
    });
    users.push(user);
  }

  // Create items
  console.log("📦 Creating items...");
  const items: any[] = [];

  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(categories);
    const size = faker.helpers.arrayElement(sizes);
    const condition = faker.helpers.arrayElement(conditions);
    const brand = faker.helpers.maybe(
      () => faker.helpers.arrayElement(brands),
      { probability: 0.7 }
    );
    const title = getRandomItems(category);
    const user = faker.helpers.arrayElement(users);

    let pointValue = getPointValueByCategory(category);

    if (i < 20) {
      pointValue = faker.number.int({ min: 5, max: 50 });
    } else if (i < 40) {
      pointValue = faker.number.int({ min: 100, max: 300 });
    } else if (i < 50) {
      pointValue = faker.number.int({ min: 400, max: 1000 });
    }

    const item = await prisma.item.create({
      data: {
        title: `${brand ? brand + " " : ""}${title}`,
        description: generateDescription(title, category, condition, brand),
        category,
        size,
        condition,
        brand,
        images: generateImages(category),
        pointValue,
        status: faker.helpers.arrayElement(["available", "sold", "pending"]),
        isApproved: faker.helpers.maybe(() => true, { probability: 0.85 }),
        userId: user.id,
        createdAt: faker.date.recent({ days: 90 }),
      },
    });

    items.push(item);
  }

  // Create some swaps
  console.log("🔄 Creating swaps...");
  for (let i = 0; i < 20; i++) {
    const requester = faker.helpers.arrayElement(users);
    const item = faker.helpers.arrayElement(
      items.filter((item) => item.userId !== requester.id)
    );

    await prisma.swap.create({
      data: {
        status: faker.helpers.arrayElement([
          "pending",
          "accepted",
          "rejected",
          "completed",
        ]),
        message: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.6,
        }),
        pointsUsed: faker.number.int({ min: 0, max: item.pointValue }),
        requesterId: requester.id,
        ownerId: item.userId,
        itemId: item.id,
        createdAt: faker.date.recent({ days: 30 }),
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${items.length} items`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
