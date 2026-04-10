import { Feed } from "./lib/db/schema";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    }
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export function RSSFeedFactoryParse(parsedXML : any) : RSSFeed {

    if(!parsedXML) {
        throw new Error(`RSSFeedFactoryParse Error: No ParsedXML feed provided: ${parsedXML}.`)
    }

    if (!parsedXML.channel) {
        throw new Error(`RSSFeedFactoryParse Error: ParsedXML has no 'channel'.`);
    }

    if(!parsedXML.channel.title || typeof parsedXML.channel.title !== "string") {
        throw new Error(`RSSFeedFactoryParse Error: ParsedXML has no 'channel.title'.`);
    }
    const title = parsedXML.channel.title;

    if(!parsedXML.channel.link || typeof parsedXML.channel.link !== "string") {
        throw new Error(`RSSFeedFactoryParse Error: ParsedXML has no 'channel.link'.`);
    }
    const link = parsedXML.channel.link;

    if(!parsedXML.channel.description || typeof parsedXML.channel.description !== "string") {
        throw new Error(`RSSFeedFactoryParse Error: ParsedXML has no 'channel.description'.`);
    }
    const description = parsedXML.channel.description;


    // Get RSSItems, if any
    let rssItems : RSSItem[];


    if(!parsedXML.channel.item || !Array.isArray(parsedXML.channel.item)) {
        rssItems = [];
    }
    else {
        const rawItems = parsedXML.channel.item as any[];
        // Parse RSSItems
        rssItems = RSSItemFactoryParse(rawItems);
    }

    // Put it together in a final item
    return {
        channel: {
            title,
            link,
            description,
            item: rssItems,
        },
    };
}

function RSSItemFactoryParse(parsedItems : any) : RSSItem[] {
    const rssItems = new Array<RSSItem>();

    for(const item of parsedItems) {

        if(!item.title || typeof item.title !== "string") {
            continue;
        }
        const title = item.title;

        if(!item.link || typeof item.link !== "string") {
            continue;
        }
        const link = item.link;

        if(!item.description || typeof item.description !== "string") {
            continue;
        }
        const description = item.description;

        if(!item.pubDate || typeof item.pubDate !== "string") {
            continue;
        }
        const pubDate = item.pubDate;

        rssItems.push({
            title,
            link,
            description,
            pubDate
        });
    }

    return rssItems;
}


export async function printFeed(feed : Feed) {
    console.log(JSON.stringify(feed));
};