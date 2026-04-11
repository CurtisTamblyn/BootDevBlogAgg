import { getLoggedInUserHandler } from "./command-decorators";
import { CLICommand, getCommands } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName } from "./lib/db/queries/feedfollows";
import { User } from "./lib/db/schema";

async function commandFollow(cmdName: string, user: User, ...args: string[]) {
    
    if(args.length < 1) {
        throw new Error("Follow Error: Requires one parameter: URL for the feed.");
    }

    const url = args[0];

    const result = await createFeedFollowFromURLUserName(user.name, url);
    if(!result) {
        console.log(`Follow error: Could not create follow entry`);
        return;
    }

    console.log(`Created follow for: ${user.name}, for URL: ${url}`);

}

export const FollowCommand : CLICommand = {
    name: "follow",
    description: "Have the logged in user follow a feed",
    callback: getLoggedInUserHandler(commandFollow),
};