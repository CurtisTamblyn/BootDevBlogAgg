import { getLoggedInUserHandler } from "./command-decorators";
import { CLICommand, getCommands } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName, deleteFeedFollow } from "./lib/db/queries/feedfollows";
import { User } from "./lib/db/schema";

async function commandUnfollow(cmdName: string, user: User, ...args: string[]) {
    
    if(args.length < 1) {
        throw new Error("Follow Error: Requires one parameter: URL for the feed.");
    }

    const url = args[0];

    await deleteFeedFollow(user.id, url);

}

export const UnfollowCommand : CLICommand = {
    name: "unfollow",
    description: "Have a user unfollow a feed",
    callback: getLoggedInUserHandler(commandUnfollow),
};