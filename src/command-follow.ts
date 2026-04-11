import { CLICommand, getCommands } from "./commands";
import { readConfig } from "./config";
import { createFeedFollowFromURLUserName } from "./lib/db/queries/feedfollows";

async function commandFollow(cmdName: string, ...args: string[]) {
    
    if(args.length < 1) {
        throw new Error("Follow Error: Requires one parameter: URL for the feed.");
    }

    const url = args[0];
    const username = readConfig().currentUserName;

    const result = await createFeedFollowFromURLUserName(username, url);
    if(!result) {
        console.log(`Follow error: Could not create follow entry`);
        return;
    }

    console.log(`Created follow for: ${username}, for URL: ${url}`);

}

export const FollowCommand : CLICommand = {
    name: "follow",
    description: "Have the logged in user follow a feed",
    callback: commandFollow,
};