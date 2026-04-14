import { XMLParser } from "fast-xml-parser";
import { RSSFeed, RSSFeedFactoryParse } from "./rss";
import { getOldestFeed, markFeedFethed } from "./lib/db/queries/feeds";
import { feedFollows } from "./lib/db/schema";

type ScrapeResultSuccess = {
    result: "success";
}
type ScrapeResultError = {
    result: "error";
    error: string;
}
export type ScrapeResult = ScrapeResultSuccess | ScrapeResultError;

export async function scrapeNextFeed() : Promise<ScrapeResult> {

    const feed = await getOldestFeed();
    if(!feed) {
        return { result: "error", error: "No oldest feed found" };
    }

    await markFeedFethed(feed.id);

    let feedContent:RSSFeed;

    try {
        feedContent = await fetchFeed(feed.url);
    }
    catch(error) {
        const e = error as Error;
        return { result: "error", error: `Error on fetchFeed: ${e.message}`};
    }

    console.log(`Feed retrieved for ${feed.name}`);
    for(const item of feedContent.channel.item) {
        console.log(`** ${item.title} **`);
        console.log(`Date: ${item.pubDate}`);
        console.log(`Link: ${item.link}`);
        console.log(`Descripton: ${item.description}`);
        console.log("");
    }

    return { result: "success" };
}


export async function fetchFeed(feedURL : string) {

    const response = await fetch(feedURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        }
    })

    if(!response.ok) {
        throw new Error(`Failed to fetch RSS. Code: ${response.status},  message: ${response.statusText}`);
    }

    const rawFeed = await response.text();
    let rssFeed : RSSFeed;

    try {
        const parser = new XMLParser();
        const parsedXML = parser.parse(rawFeed);

        if(!parsedXML.rss) {
            throw new Error(`fetchFeed Error: ParsedXML has no 'rss'.`);
        }

        rssFeed = RSSFeedFactoryParse(parsedXML.rss);
    }
    catch(error) {
        const e = error as Error;
        throw new Error(`Error when parsing RSS XML: ${e.message}`);
    }

    return rssFeed;
}