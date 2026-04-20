import { db } from "./connection";
import { users, tasks, tags, taskTags } from "./schema";
import { hashPassword } from "../utils/password";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  try {
    console.log("Clearing existing tables...");

    await db.delete(taskTags);
    await db.delete(tags);
    await db.delete(tasks);
    await db.delete(users);

    console.log("Creating users...");

    const hashedPass = await hashPassword("123");

    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Admin User",
          age: 25,
          email: "admin@gmail.com",
          password: hashedPass,
          role: "admin",
        },
        {
          name: "Regular User",
          age: 20,
          email: "user@gmail.com",
          password: hashedPass,
          role: "user",
        },
      ])
      .returning();

    const adminUser = insertedUsers.find((u) => u.role === "admin");

    console.log("Admin created:", adminUser?.email);

    console.log("Creating demo task...");

    const [demoTask] = await db
      .insert(tasks)
      .values({
        summary: "Demo Task",
        details: "This is a demo task",
        userId: adminUser!.id,
      })
      .returning();

    console.log("Creating tags...");

    const demoTags = await db
      .insert(tags)
      .values([
        { name: "UI/UX", color: "blue" },
        { name: "FE", color: "green" },
        { name: "BE", color: "grey" },
        { name: "DevOps", color: "red" },
      ])
      .returning();

    console.log("Linking tags to task...");

    await db.insert(taskTags).values(
      demoTags.map((tag) => ({
        taskId: demoTask.id,
        tagId: tag.id,
      })),
    );

    console.log("Seeding completed successfully!");
    console.log("Admin login:");
    console.log("Email: admin@gmail.com");
    console.log("Password: 123");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seed();
