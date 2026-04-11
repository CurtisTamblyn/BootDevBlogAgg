import { CLICommand } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName } from "./lib/db/queries/feedfollows";
import { createFeed } from "./lib/db/queries/feeds";
import { getUserFromName } from "./lib/db/queries/users";
import { feeds } from "./lib/db/schema";
import { printFeed } from "./rss";

async function commandAddFeed(cmdName: string, ...args: string[]) {

    if(args.length < 2) {
        throw new Error("AddFeed Error: Requires two parameters: A feed name and URL to the feed.");
    }

    const username = readConfig().currentUserName;
    if(!username || username.length <= 0) {
        throw new Error("AddFeed Error: No logged in user found.");
    }

    const user = await getUserFromName(username);
    if(!user) {
        throw new Error(`AddFeed Error: Could not locate user: ${username}`);
    }

    const feedName = args[0];
    const feedURL = args[1];
    const userID = user.id;

    const result = await createFeed(feedName, feedURL, userID);
    if(!result) {
        throw new Error("AddFeed Error: An error occured when creating new feed");
    }

    await createFeedFollowFromURLUserName(username, feedURL);

    console.log(`Created RSS Feed`);
    printFeed(result);
}

export const AddFeedCommand : CLICommand = {
    name: "addfeed",
    description: "Add a RSS feed URL to the database",
    callback: commandAddFeed,
};