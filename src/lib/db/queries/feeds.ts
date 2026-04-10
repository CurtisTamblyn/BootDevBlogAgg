import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const result = await db.insert(feeds).values({ name: name, url: url, userId: userId}).returning();
    return firstOrUndefined(result);
}

export async function getAllFeeds() {
    const feedsList = await db.select().from(feeds);
    return feedsList;
}

export async function getAllFeedsWithCreator() {
    const result = await db.select({
        name: feeds.name,
        url: feeds.url,
        creatorName: users.name,
    }).from(feeds).innerJoin(users, eq(feeds.userId, users.id));
    return result;
}