import { CommandHandler } from "./commands";
import { readConfig } from "./config";
import { getUserFromName } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;


export function getLoggedInUserHandler(handler : UserCommandHandler) :  CommandHandler {

    return async(cmdName: string, ...args: string[]) : Promise<void> => {
        
        const username = readConfig().currentUserName;
        if(!username || username.length <= 0) {
            throw new Error("No valid user found in config, please register or log in");
        }
    
        const userResult = await getUserFromName(username);
        if(!userResult) {
            throw new Error(`User not found: ${userResult}`)
        }

        await handler(cmdName, userResult, ...args);
    };
};


