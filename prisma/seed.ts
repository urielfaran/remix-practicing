import { PrismaClient } from "@prisma/client";
import { authenticator } from "~/auth/authenticator";

const prisma = new PrismaClient();

async function main() {
  // Seed your database here
  // You can do something like this:

  await authenticator.register({
    username: "test",
    password: "password",
  });
  // await authenticator.register({
  //   username: "test1",
  //   password: "password1",
  // });
}

main()
  .then(async () => {
    console.log("Seeding complete 🌱");
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    console.log("Seeding failed");
    prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => {});
