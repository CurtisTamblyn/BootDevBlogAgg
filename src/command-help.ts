import { CLICommand, getCommands } from "./commands";

function commandHelp(cmdName: string, ...args: string[]) {
    
    console.log(`Commands:`);

    const registry = getCommands();

    for(const registryCommand of Object.values(registry)) {
        console.log(`${registryCommand.name}: ${registryCommand.description}`);
    }
}

export const HelpCommand : CLICommand = {
    name: "help",
    description: "Display help for all commands",
    callback: commandHelp,
};