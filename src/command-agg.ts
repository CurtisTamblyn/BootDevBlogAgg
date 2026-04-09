import { CLICommand } from "./commands";
import { fetchFeed } from "./feedService";

async function commandAgg(cmdName: string, ...args: string[]) {

    let url : string;

    if(args.length <= 0) {
        url = "https://www.wagslane.dev/index.xml";
    }
    else {
        url = args[0];
    }

    const rss = await fetchFeed(url);

    console.log(JSON.stringify(rss, null, 2));
}

export const AggCommand : CLICommand = {
    name: "agg",
    description: "TODO: get RSS stuff",
    callback: commandAgg,
};