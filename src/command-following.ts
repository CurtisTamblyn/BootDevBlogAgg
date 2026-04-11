import { getLoggedInUserHandler } from "./command-decorators";
import { CLICommand, getCommands } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName, getFeedFollowersForUser } from "./lib/db/queries/feedfollows";
import { User } from "./lib/db/schema";

async function commandFollowing(cmdName: string, user: User, ...args: string[]) {
    
    const feeds = await getFeedFollowersForUser(user.name);
    
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
    callback: getLoggedInUserHandler(commandFollowing),
};