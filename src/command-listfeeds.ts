import { CLICommand } from "./commands";
import { getAllFeedsWithCreator } from "./lib/db/queries/feeds";

async function commandListFeeds(cmdName: string, ...args: string[]) {

    const feeds = await getAllFeedsWithCreator();
    if(feeds.length <= 0) {
        console.log("No feeds found to list.");
        return;
    }

    for(const feed of feeds) {

        console.log(`Feed: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`Created by: ${feed.creatorName}`);
    }

}

export const ListFeedsCommand : CLICommand = {
    name: "feeds",
    description: "Display all feeds saved in the database",
    callback: commandListFeeds,
};