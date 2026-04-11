import { EnforceLowercase, assertNever } from "./helpers";
import { LoginCommand } from "./command-login";
import { HelpCommand } from "./command-help";
import { RegisterCommand } from "./command-register";
import { ResetCommand } from "./command-reset";
import { ListUsersCommand } from "./command-listusers";
import { AggCommand } from "./command-agg";
import { AddFeedCommand } from "./command-addfeed";
import { ListFeedsCommand } from "./command-listfeeds";
import { FollowCommand } from "./command-follow";
import { FollowingCommand } from "./command-following";
import { User } from "./lib/db/schema";

// Our command keys are listed here
// The array is the truth, all other command keys are derived from it
// Done this way to give some extra compile-time protection from missing command details
export const CommandKeys = ["follow", "following", "agg", "addfeed", "feeds", "login", "register", "users", "reset", "help" ] as const;
export type Commands = EnforceLowercase<typeof CommandKeys[number]>;


export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

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
            case "follow":
                cliCommand = FollowCommand;
                break;
            case "following":
                cliCommand = FollowingCommand;
                break;
            case "agg":
                cliCommand = AggCommand;
                break;
            case "addfeed":
                cliCommand = AddFeedCommand;
                break;
            case "feeds":
                cliCommand = ListFeedsCommand;
                break;
            case "login":
                cliCommand = LoginCommand;
                break;
            case "help":
                cliCommand = HelpCommand;
                break;
            case "register":
                cliCommand = RegisterCommand;
                break;
            case "reset":
                cliCommand = ResetCommand;
                break;
            case "users":
                cliCommand = ListUsersCommand;
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
    
    return command.callback(commandName, ...args);
}