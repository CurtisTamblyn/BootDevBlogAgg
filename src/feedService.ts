import { XMLParser } from "fast-xml-parser";
import { RSSFeed, RSSFeedFactoryParse } from "./rss";

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