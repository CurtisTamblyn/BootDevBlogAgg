import { EnforceLowercase, assertNever } from "./helpers";
import { LoginCommand } from "./command-login";
import { HelpCommand } from "./command-help";


// Our command keys are listed here
// The array is the truth, all other command keys are derived from it
// Done this way to give some extra compile-time protection from missing command details
export const CommandKeys = ["login", "help" ] as const;
export type Commands = EnforceLowercase<typeof CommandKeys[number]>;


type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CLICommand = {
    name: Commands;
    description: string;
    callback: CommandHandler;
}

export type CommandsRegistry = Record<string, CLICommand>;


export function getCommands(): CommandsRegistry {

     const commandRegistry = { } as CommandsRegistry;

     for(const command of CommandKeys) {

        let cliCommand : CLICommand;

        switch(command) {
            case "login":
                cliCommand = LoginCommand;
                break;
            case "help":
                cliCommand = HelpCommand;
                break;
            default: assertNever(command); break;
        }

        commandRegistry[command] = cliCommand;
     }

     return commandRegistry;
}


export function runCommand(registry: CommandsRegistry, commandName: string, ...args: string[]) {
    const command = registry[commandName];
    if(!command) {
        throw new Error(`Command not found: ${commandName}`)
    }
    
    command.callback(commandName, ...args);
}