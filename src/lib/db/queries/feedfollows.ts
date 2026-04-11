import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeedFollowFromURLUserName(username: string, feedURL: string) {

    const userId = firstOrUndefined(await db.select({id: users.id}).from(users).where(eq(users.name, username)));
    if(!userId) {
        throw new Error(`Could not find user: ${username}`);
    }
    const feedId = firstOrUndefined(await db.select({id: feeds.id}).from(feeds).where(eq(feeds.url, feedURL)));
    if(!feedId) {
        throw new Error(`Could not find feed with URL: ${feedId}`);
    }

    return createFeedFollow(userId.id, feedId.id);
}

export async function createFeedFollow(userId: string, feedId: string) {
    const result = await db.insert(feedFollows).values({
        userId: userId,
        feedId: feedId,
    }).returning();
    return firstOrUndefined(result);
}


export async function getFeedFollowersForUser(username: string) {

    const results = await db.select({
        feedName: feeds.name,
        feedURL: feeds.url,
    })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(users.name, username));
    return results;
}