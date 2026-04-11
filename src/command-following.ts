import { CLICommand, getCommands } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName, getFeedFollowersForUser } from "./lib/db/queries/feedfollows";

async function commandFollowing(cmdName: string, ...args: string[]) {
    
    const username = readConfig().currentUserName;

    const feeds = await getFeedFollowersForUser(username);
    
    if(feeds.length <= 0) {
        console.log("You currently don't follow any feeds.");
        return;
    }

    for(const feed of feeds) {
        console.log(`Feed: ${feed.feedName}`);
        console.log(`URL: ${feed.feedURL}`);
    }
}

export const FollowingCommand : CLICommand = {
    name: "follow",
    description: "Show all feeds the user is following",
    callback: commandFollowing,
};