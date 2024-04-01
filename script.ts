import { PrismaClient } from "@prisma/client";
import { findSourceMap } from "module";

const prisma = new PrismaClient();

const userData = [
  {
    username: "Mary",
    password: "2345",
    writtenassignments: {
      create: [
        {
          title: "Buy milk",
          description: "lactose-free milk",
        },
      ],
    },
  },
  {
    username: "Helen",
    password: "5678",
    writtenassignments: {
      create: [
        {
          title: "Buy chocolate",
          description: "dark chocolate",
        },
      ],
    },
  },
  {
    username: "Tom",
    password: "098",
    writtenassignments: {
      create: [
        {
          title: "walking the dog",
          description: "in the western park",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Create user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
