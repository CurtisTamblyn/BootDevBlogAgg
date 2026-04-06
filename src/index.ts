import { exit } from "node:process";
import { getCommands, runCommand } from "./commands";
import { Config, readConfig, setUser } from "./config";

function main() {
    
    const args = process.argv;
    if(args.length <= 2) {
        console.log("Blog Aggregator: No commands passed. Pass 'help' for help.");
        exit(1);
    }

    // Sort out input variables into command and parameters
    const commandName = args[2];
    const commandParams = args.slice(3);

    // Get registry of commands to run on (should move to runCommand, no need for it to be here)
    const commandRegistry = getCommands();

    // Execute command, in try/catch in case command errors and we'll print it here and return 1
    try {
        runCommand(commandRegistry, commandName, ...commandParams);
    }
    catch(error) {
        const e = error as Error;
        console.log(e.message);
        exit(1);
    }
    
    // Falltrough, assume successful operation and return 0
    exit(0);
}

main();