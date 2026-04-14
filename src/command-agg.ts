import { CLICommand } from "./commands";
import { fetchFeed, scrapeNextFeed } from "./feedService";



async function commandAgg(cmdName: string, ...args: string[]) {

    if(args.length <= 0) {
        throw new Error("Agg service requires a time to loop parameter in the format: (time)(unit)");
    }

    const durationStr = args[0];
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if(!match) {
        throw new Error(`Agg service could not parse time unit passed: ${durationStr}`);
    }

    const timeValue = Number.parseInt(match[1]);
    const timeUnit = match[2];
    let multiplier : number;
    switch(timeUnit) {
        case "ms": multiplier = 1; break;
        case "s": multiplier = 100; break;
        case "m": multiplier = 6000; break;
        case "h": multiplier = 360_000; break;
        default: throw new Error(`Could not parse time unit: ${timeUnit}`);
    }
    const timeIntervalMS = Math.max(timeValue * multiplier, 10000);

    console.log(`Beginning log aggreagtor service at interval: ${timeIntervalMS}ms`);

    const interval = setInterval(async () => {
        try {
            const scrapeResult = await scrapeNextFeed();
            if(scrapeResult.result == "error") {
                console.log(`Error when getting feed: ${scrapeResult.error}`);
            }
        }
        catch(error) {
            const e = error as Error;
            console.log(`Critical error when getting feed: ${e.message}`);
        }
    }, timeIntervalMS);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });


    //console.log(JSON.stringify(rss, null, 2));
}

export const AggCommand : CLICommand = {
    name: "agg",
    description: "TODO: get RSS stuff",
    callback: commandAgg,
};