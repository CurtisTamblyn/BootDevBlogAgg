import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
    const result = await db.insert(users).values({ name: name }).returning();
    return firstOrUndefined(result);
}

export async function getUserFromName(username: string) {
    const userResult = await db.select().from(users).where(eq(users.name, username));
    return firstOrUndefined(userResult);
}

export async function getUserFromID(userId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId));
    return firstOrUndefined(userResult);
}

export async function getAllUsers() {
    const userList = await db.select().from(users);
    return userList;
}

export async function resetUsers() {
    await db.delete(users);
}