import { db } from "..";
import { Feed, feedFollows, feeds, posts, User } from "../schema";
import { eq, desc, count } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { RSSItem } from "src/rss";

export async function createPost(rssItem: RSSItem, feedId: string) {

    let date : Date | null;
    try {
        date = new Date(rssItem.pubDate);
    }
    catch {
        date = null;
    }

    const result = await db.insert(posts)
        .values({
            title: rssItem.title,
            url: rssItem.link,
            description: rssItem.description,
            publishedAt: date,
            feedId: feedId,
        }).returning();

    return firstOrUndefined(result);
}

export async function postURLExists(url:string) {

    const [exists] = await db
        .select({count: count()})
        .from(posts)
        .where(eq(posts.url, url));
    
    return exists.count > 0;
}

export async function getPostsForUser(user: User, limit:number = 2, offset:number = 0) {

    console.log(`Getting posts for user: ${user.id}`);

    const userPosts = await db.select(
        {
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
        })
        .from(posts)
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
        .where(eq(feedFollows.userId, user.id))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        .offset(offset);

    return userPosts;
}