import { db } from "..";
import { feeds, users } from "../schema";
import { eq, sql } from "drizzle-orm";
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

export async function markFeedFethed(feedId: string) {

    const result = await db.update(feeds)
        .set({lastFetchedAt: sql`NOW()`})
        .where(eq(feeds.id, feedId))
        .returning();
    
    return result;
}

export async function getOldestFeed() {

    const nextFeed : { id:string, name:string, url:string }[] = 
        await db
        .execute(sql`SELECT id, name, url FROM feeds ORDER BY last_fetched_at NULLS FIRST LIMIT(1)`);

    return firstOrUndefined(nextFeed);
}