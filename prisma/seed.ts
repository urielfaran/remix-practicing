import { PrismaClient } from "@prisma/client";
import { authenticator } from "~/auth/authenticator";

const prisma = new PrismaClient();

const users = [
  {
    username: "test",
    password: "password",
  },
  {
    username: "test1",
    password: "password1",
  },
  {
    username: "test2",
    password: "password2",
  },
  {
    username: "test3",
    password: "password3",
  },
  {
    username: "test4",
    password: "password4",
  },
  {
    username: "test5",
    password: "password5",
  },
  {
    username: "test6",
    password: "password6",
  },
  {
    username: "test7",
    password: "password7",
  },
  {
    username: "test8",
    password: "password8",
  },
];


async function main() {
  // Seed your database here
  // You can do something like this:
  
  users.map(async ({ username, password }) => {
    await authenticator.register({
      username: username,
      password: password,
    });
  });
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

